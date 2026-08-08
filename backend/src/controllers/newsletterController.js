const { pool } = require("../db/database");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function subscribeToNewsletter(req, res) {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email is required."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }

  try {
    const [result] = await pool.execute(
      `
        INSERT INTO newsletter_subscribers (email)
        VALUES (?)
      `,
      [normalizedEmail]
    );

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter.",
      id: result.insertId
    });
  } catch (error) {
    // MySQL duplicate-key error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed."
      });
    }

    console.error("Newsletter subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
}

module.exports = {
  subscribeToNewsletter
};