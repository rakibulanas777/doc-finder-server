const express = require("express");
const {
  loginController,
  registerController,
  authController,
} = require("../controllers/user");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", protect, authController);

module.exports = router;
