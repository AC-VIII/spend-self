const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  subscribeToNewsletter
} = require("../controllers/newsletterController");

const router = express.Router();

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many subscription attempts. Please try again later."
  }
});

router.post(
  "/subscribe",
  newsletterLimiter,
  subscribeToNewsletter
);

module.exports = router;