const {pool} = require("../db/database");

function generateBookingNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(
    100 + Math.random() * 900
  );

  return `SS-${timestamp}${random}`;
}

function calculateNights(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  const difference =
    end.getTime() - start.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

exports.createBooking = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      stayId,
      checkIn,
      checkOut,
      guests,
      guest,
    } = req.body;

    /*
     * ---------------------------------------------
     * Validate request
     * ---------------------------------------------
     */

    if (
      !stayId ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !guest
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required booking information.",
      });
    }

    if (
      !guest.fullName ||
      !guest.country ||
      !guest.phone ||
      !guest.email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete guest information is required.",
      });
    }

    /*
     * ---------------------------------------------
     * Validate dates
     * ---------------------------------------------
     */

    const nights = calculateNights(
      checkIn,
      checkOut
    );

    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Check-out must be after check-in.",
      });
    }

    /*
     * ---------------------------------------------
     * Start transaction
     * ---------------------------------------------
     */

    await connection.beginTransaction();

    /*
     * ---------------------------------------------
     * Get stay
     * ---------------------------------------------
     */

    const [stays] = await connection.execute(
      `
      SELECT
        id,
        name,
        price_per_night,
        currency,
        max_guests
      FROM stays
      WHERE id = ?
        AND status = 'active'
      LIMIT 1
      `,
      [stayId]
    );

    if (stays.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Stay not found.",
      });
    }

    const stay = stays[0];

    /*
     * ---------------------------------------------
     * Validate guest count
     * ---------------------------------------------
     */

    if (
      Number(guests) < 1 ||
      Number(guests) > stay.max_guests
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `This stay allows a maximum of ${stay.max_guests} guests.`,
      });
    }

    /*
     * ---------------------------------------------
     * Check availability
     *
     * Overlap condition:
     *
     * existing.check_in < requested.check_out
     * AND
     * existing.check_out > requested.check_in
     * ---------------------------------------------
     */

    const [existingBookings] =
      await connection.execute(
        `
        SELECT id
        FROM bookings
        WHERE stay_id = ?

          AND status IN ('pending', 'confirmed')

          AND check_in < ?
          AND check_out > ?

        LIMIT 1
        `,
        [
          stayId,
          checkOut,
          checkIn,
        ]
      );

    if (existingBookings.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message:
          "This stay is not available for the selected dates.",
      });
    }

    /*
     * ---------------------------------------------
     * Calculate total on SERVER
     * ---------------------------------------------
     */

    const pricePerNight =
      Number(stay.price_per_night);

    const totalAmount =
      pricePerNight * nights;

    /*
     * ---------------------------------------------
     * Find existing guest
     * ---------------------------------------------
     */

    const normalizedEmail =
      guest.email.trim().toLowerCase();

    const [existingGuests] =
      await connection.execute(
        `
        SELECT id
        FROM guests
        WHERE email = ?
        LIMIT 1
        `,
        [normalizedEmail]
      );

    let guestId;

    if (existingGuests.length > 0) {
      /*
       * Existing guest
       */

      guestId = existingGuests[0].id;

      await connection.execute(
        `
        UPDATE guests
        SET
          full_name = ?,
          country = ?,
          phone = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
          guest.fullName.trim(),
          guest.country.trim(),
          guest.phone.trim(),
          guestId,
        ]
      );
    } else {
      /*
       * New guest
       */

      const [guestResult] =
        await connection.execute(
          `
          INSERT INTO guests (
            full_name,
            country,
            phone,
            email
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            guest.fullName.trim(),
            guest.country.trim(),
            guest.phone.trim(),
            normalizedEmail,
          ]
        );

      guestId = guestResult.insertId;
    }

    /*
     * ---------------------------------------------
     * Create booking
     * ---------------------------------------------
     */

    const bookingNumber =
      generateBookingNumber();

    const [bookingResult] =
      await connection.execute(
        `
        INSERT INTO bookings (
          booking_number,
          stay_id,
          guest_id,
          check_in,
          check_out,
          guests,
          nights,
          special_requests,
          total_amount,
          currency,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          bookingNumber,
          stayId,
          guestId,
          checkIn,
          checkOut,
          guests,
          nights,
          guest.specialRequests?.trim() || null,
          totalAmount,
          stay.currency,
          "confirmed",
        ]
      );

    /*
     * ---------------------------------------------
     * Commit transaction
     * ---------------------------------------------
     */

    await connection.commit();

    /*
     * ---------------------------------------------
     * Response
     * ---------------------------------------------
     */

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",

      booking: {
        id: bookingResult.insertId,
        bookingNumber,

        stay: {
          id: stay.id,
          name: stay.name,
        },

        checkIn,
        checkOut,

        guests,
        nights,

        guest: {
          id: guestId,
          fullName: guest.fullName,
          country: guest.country,
          phone: guest.phone,
          email: normalizedEmail,
          specialRequests:
            guest.specialRequests || "",
        },

        pricePerNight,
        totalAmount,
        currency: stay.currency,

        status: "confirmed",
      },
    });
  } catch (error) {
    /*
     * Rollback if something fails.
     */

    await connection.rollback();

    console.error(
      "Create booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create booking.",
    });
  } finally {
    connection.release();
  }
};


exports.getBooking = async (req, res) => {
  try {
    const { bookingNumber } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT
        b.id,
        b.booking_number,
        b.check_in,
        b.check_out,
        b.guests,
        b.nights,
        b.special_requests,
        b.total_amount,
        b.currency,
        b.status,
        b.created_at,

        s.id AS stay_id,
        s.name AS stay_name,
        s.location AS stay_location,

        g.id AS guest_id,
        g.full_name,
        g.country,
        g.phone,
        g.email

      FROM bookings b

      INNER JOIN stays s
        ON s.id = b.stay_id

      INNER JOIN guests g
        ON g.id = b.guest_id

      WHERE b.booking_number = ?

      LIMIT 1
      `,
      [bookingNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const booking = rows[0];

    return res.status(200).json({
      success: true,

      booking: {
        id: booking.id,
        bookingNumber:
          booking.booking_number,

        stay: {
          id: booking.stay_id,
          name: booking.stay_name,
          location:
            booking.stay_location,
        },

        checkIn: booking.check_in,
        checkOut: booking.check_out,

        guests: booking.guests,
        nights: booking.nights,

        guest: {
          id: booking.guest_id,
          fullName: booking.full_name,
          country: booking.country,
          phone: booking.phone,
          email: booking.email,
        },

        specialRequests:
          booking.special_requests,

        totalAmount:
          booking.total_amount,

        currency: booking.currency,

        status: booking.status,

        createdAt:
          booking.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Get booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve booking.",
    });
  }
};