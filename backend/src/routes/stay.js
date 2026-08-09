const express = require("express");

const router = express.Router();

const {
  getStays,
  getStayById,
  getStayAvailability
} = require("../controllers/stayController");

router.get("/", getStays);
router.get("/:id", getStayById);

router.get("/:stayId/availability",getStayAvailability);

module.exports = router;