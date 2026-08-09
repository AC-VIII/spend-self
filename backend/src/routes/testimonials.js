const express = require("express");

const {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();

/*
 * Public
 */

router.get(
  "/featured",
  getFeaturedTestimonials
);

router.get(
  "/",
  getTestimonials
);

router.get(
  "/:id",
  getTestimonial
);


/*
 * Admin / management
 *
 * Add authentication middleware here
 * when admin authentication is implemented.
 */

router.post(
  "/",
  createTestimonial
);

router.put(
  "/:id",
  updateTestimonial
);

router.delete(
  "/:id",
  deleteTestimonial
);

module.exports = router;