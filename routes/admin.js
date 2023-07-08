const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
} = require("../controllers/admin");
const router = express.Router();
router.get("/getAllUsers", protect, getAllUsersController);
router.get("/getAllDoctors", protect, getAllDoctorsController);
router.post("/changeAccountStatus", protect, changeAccountStatusController);
module.exports = router;
