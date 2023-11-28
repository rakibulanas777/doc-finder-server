const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  getApprovedAppointmentsController,
  markCompleteController,
  revenueController,
} = require("../controllers/doctor");

const router = express.Router();

router.post("/getDoctorInfo", protect, getDoctorInfoController);
router.post("/updateProfile", protect, updateProfileController);
router.post(
  "/approved-appointments",
  protect,
  getApprovedAppointmentsController
);
router.post("/getDoctorById", protect, getDoctorByIdController);
router.put("/appointments/:appointmentId/complete", markCompleteController);
router.get("/doctor-appointments", protect, doctorAppointmentsController);

router.get("/revenue", protect, revenueController);
router.post("/update-status", protect, updateStatusController);

module.exports = router;
