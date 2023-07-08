const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/user");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", protect, authController);
router.post("/apply-doctor", protect, applyDoctorController);
router.post("/get-all-notification", protect, getAllNotificationController);
router.post(
  "/delete-all-notification",
  protect,
  deleteAllNotificationController
);

router.post("/getAllDoctors", protect, getAllDocotrsController);
router.post("/book-appointment", protect, bookAppointmnetController);
router.post("/booking-availbility", protect, bookingAvailabilityController);
router.get("/user-appointments", protect, userAppointmentsController);
module.exports = router;
