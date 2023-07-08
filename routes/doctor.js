const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctor");

const router = express.Router();

router.post("/getDoctorInfo", protect, getDoctorInfoController);
router.post("/updateProfile", protect, updateProfileController);

router.post("/getDoctorById", protect, getDoctorByIdController);

router.get("/doctor-appointments", protect, doctorAppointmentsController);

router.post("/update-status", protect, updateStatusController);

module.exports = router;
