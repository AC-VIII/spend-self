const { pool } = require("../db/database");

/*
 * ---------------------------------------------
 * GET ALL PUBLISHED TESTIMONIALS
 * ---------------------------------------------
 */

exports.getTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        role,
        location,
        quote,
        image,
        rating,
        featured
      FROM testimonials
      WHERE status = 'published'
      ORDER BY display_order ASC, created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      testimonials: rows.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        location: testimonial.location,
        quote: testimonial.quote,
        image: testimonial.image,
        rating: testimonial.rating,
        featured: Boolean(testimonial.featured),
      })),
    });
  } catch (error) {
    console.error(
      "Get testimonials error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve testimonials.",
    });
  }
};


/*
 * ---------------------------------------------
 * GET FEATURED TESTIMONIALS
 * ---------------------------------------------
 */

exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        role,
        location,
        quote,
        image,
        rating,
        featured
      FROM testimonials
      WHERE status = 'published'
        AND featured = 1
      ORDER BY display_order ASC, created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      testimonials: rows.map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        location: testimonial.location,
        quote: testimonial.quote,
        image: testimonial.image,
        rating: testimonial.rating,
        featured: true,
      })),
    });
  } catch (error) {
    console.error(
      "Get featured testimonials error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve featured testimonials.",
    });
  }
};


/*
 * ---------------------------------------------
 * GET SINGLE TESTIMONIAL
 * ---------------------------------------------
 */

exports.getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
      SELECT
        id,
        name,
        role,
        location,
        quote,
        image,
        rating,
        featured,
        status,
        display_order,
        created_at,
        updated_at
      FROM testimonials
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    const testimonial = rows[0];

    return res.status(200).json({
      success: true,

      testimonial: {
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        location: testimonial.location,
        quote: testimonial.quote,
        image: testimonial.image,
        rating: testimonial.rating,
        featured: Boolean(
          testimonial.featured
        ),
        status: testimonial.status,
        displayOrder:
          testimonial.display_order,
        createdAt: testimonial.created_at,
        updatedAt: testimonial.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Get testimonial error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve testimonial.",
    });
  }
};


/*
 * ---------------------------------------------
 * CREATE TESTIMONIAL
 * ---------------------------------------------
 */

exports.createTestimonial = async (req, res) => {
  try {
    const {
      name,
      role,
      location,
      quote,
      image,
      rating,
      featured,
      status,
      displayOrder,
    } = req.body;

    /*
     * ---------------------------------------------
     * Validate
     * ---------------------------------------------
     */

    if (!name || !quote) {
      return res.status(400).json({
        success: false,
        message:
          "Name and quote are required.",
      });
    }

    const cleanName = name.trim();
    const cleanQuote = quote.trim();

    if (!cleanName || !cleanQuote) {
      return res.status(400).json({
        success: false,
        message:
          "Name and quote cannot be empty.",
      });
    }

    const testimonialRating =
      rating === undefined
        ? 5
        : Number(rating);

    if (
      testimonialRating < 1 ||
      testimonialRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    const [result] = await pool.execute(
      `
      INSERT INTO testimonials (
        name,
        role,
        location,
        quote,
        image,
        rating,
        featured,
        status,
        display_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        cleanName,
        role?.trim() || null,
        location?.trim() || null,
        cleanQuote,
        image?.trim() || null,
        testimonialRating,
        featured ? 1 : 0,
        status || "published",
        Number(displayOrder) || 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Testimonial created successfully.",

      testimonial: {
        id: result.insertId,
        name: cleanName,
        role: role?.trim() || null,
        location:
          location?.trim() || null,
        quote: cleanQuote,
        image: image?.trim() || null,
        rating: testimonialRating,
        featured: Boolean(featured),
        status: status || "published",
        displayOrder:
          Number(displayOrder) || 0,
      },
    });
  } catch (error) {
    console.error(
      "Create testimonial error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create testimonial.",
    });
  }
};


/*
 * ---------------------------------------------
 * UPDATE TESTIMONIAL
 * ---------------------------------------------
 */

exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      role,
      location,
      quote,
      image,
      rating,
      featured,
      status,
      displayOrder,
    } = req.body;

    if (!name || !quote) {
      return res.status(400).json({
        success: false,
        message:
          "Name and quote are required.",
      });
    }

    const testimonialRating =
      rating === undefined
        ? 5
        : Number(rating);

    if (
      testimonialRating < 1 ||
      testimonialRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    const [result] = await pool.execute(
      `
      UPDATE testimonials
      SET
        name = ?,
        role = ?,
        location = ?,
        quote = ?,
        image = ?,
        rating = ?,
        featured = ?,
        status = ?,
        display_order = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        role?.trim() || null,
        location?.trim() || null,
        quote.trim(),
        image?.trim() || null,
        testimonialRating,
        featured ? 1 : 0,
        status || "published",
        Number(displayOrder) || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Testimonial updated successfully.",
    });
  } catch (error) {
    console.error(
      "Update testimonial error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update testimonial.",
    });
  }
};


/*
 * ---------------------------------------------
 * DELETE TESTIMONIAL
 * ---------------------------------------------
 */

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      `
      DELETE FROM testimonials
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete testimonial error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete testimonial.",
    });
  }
};