const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBooking,
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get(
  "/:bookingNumber",
  getBooking
);

module.exports = router;