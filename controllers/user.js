const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        message: "User Already Exist",
        success: false,
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    const confrimHashPassword = await bcrypt.hash(
      req.body.passwordConfrim,
      salt
    );

    req.body.passwordConfrim = confrimHashPassword;

    if (req.body.password === req.body.passwordConfrim) {
      const newUser = new User(req.body);
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(201).send({
        message: "Register Successfully",
        data: {
          user: newUser,
          token,
        },
        success: true,
      });
    } else {
      return res
        .status(200)
        .send({ message: "Password does not match", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    const signuser = await User.findOne({ email: req.body.email });
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid email and password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "Login Successfully",
      data: {
        user: signuser,
        token,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register controller ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      console.log(user);
      return res.status(200).send({
        message: "Register Successfully",
        data: {
          user,
        },
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Auth error`,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `has a applied for a doctor account`,
      data: {
        doctor: newDoctor,
      },
    });

    await User.findByIdAndUpdate(adminUser._id, { notification });
    return res.status(201).send({
      message: "Doctor account Applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error while Applying for Doctor`,
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error for getting notification`,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `unable to delete all notifications`,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
};
