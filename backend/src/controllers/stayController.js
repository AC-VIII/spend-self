const {pool} = require("../db/database");

exports.getStays = async (req, res) => {
  try {
    const [stays] = await pool.execute(`
      SELECT
        id,
        name,
        slug,
        location,
        description,
        short_description,
        price_per_night,
        currency,
        max_guests,
        amenities,
        image_url,
        status,
        created_at,
        updated_at
      FROM stays
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);

    const formattedStays = stays.map((stay) => ({
      ...stay,
      amenities:
        typeof stay.amenities === "string"
          ? JSON.parse(stay.amenities)
          : stay.amenities,
    }));

    return res.status(200).json({
      success: true,
      stays: formattedStays,
    });
  } catch (error) {
    console.error("Get stays error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch stays.",
    });
  }
};

exports.getStayById = async (req, res) => {
  try {
    const { id } = req.params;

    const [stays] = await pool.execute(
      `
      SELECT
        id,
        name,
        slug,
        location,
        description,
        short_description,
        price_per_night,
        currency,
        max_guests,
        amenities,
        image_url,
        video_url,
        gallery,
        experience,
        virtual_experience_url,
        virtual_experience,
        status,
        created_at,
        updated_at
      FROM stays
      WHERE slug = ?
        AND status = 'active'
      LIMIT 1
      `,
      [id]
    );

    if (stays.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stay not found.",
      });
    }

    const stay = stays[0];

    if (typeof stay.amenities === "string") {
      stay.amenities = JSON.parse(stay.amenities);
    }

    return res.status(200).json({
      success: true,
      stay,
    });
  } catch (error) {
    console.error("Get stay error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch stay.",
    });
  }
};


exports.getStayAvailability = async (req, res) => {
  try {
    const { stayId } = req.params;

    const [bookings] = await pool.execute(
      `
      SELECT
        check_in,
        check_out
      FROM bookings
      WHERE stay_id = ?
        AND status IN ('pending', 'confirmed')
        AND check_out >= CURDATE()
      ORDER BY check_in ASC
      `,
      [stayId]
    );

    const unavailableDates = [];

    for (const booking of bookings) {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);

      const current = new Date(start);

      while (current < end) {
        unavailableDates.push(
          current.toISOString().split("T")[0]
        );

        current.setDate(
          current.getDate() + 1
        );
      }
    }

    res.json({
      success: true,
      stay_id: Number(stayId),
      unavailable_dates: [
        ...new Set(unavailableDates),
      ],
    });
  } catch (error) {
    console.error(
      "Get stay availability error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to get stay availability",
    });
  }
};