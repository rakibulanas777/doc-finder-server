const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51LM2J1SIiDyURhxDcwcDsr2pkYCLeu8MVqvXDNb5Dgap0qkfEBn1O8H0GHos3NHaS68eWsR1ocBhbniPOLgHG5AL00WDJsrnCf"
);

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

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    await user.save();
    console.log(user);
    res.status(201).send({
      success: true,
      message: "User Profile Updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User Profile Update issue",
      error,
    });
  }
};

const getUserInfoController = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.body.userId });
    console.log(user);
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

//BOOK APPOINTMENT
const bookAppointmnetController = async (req, res) => {
  try {
    console.log("Original Date:", req.body.date);
    console.log("Original Time:", req.body.time);

    // Convert date
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    console.log("Converted Date:", req.body.date);

    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    req.body.status = "pending";

    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const { doctorInfo } = req.body;

    const findAppoinment = await appointmentModel
      .findOne({ doctorInfo: doctorInfo })
      .populate("doctorInfo");
    console.log(findAppoinment);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `paid to ${findAppoinment.doctorInfo.name}`, // Product name
            },
            unit_amount: findAppoinment.doctorInfo.feesPerConsaltation * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/", // Redirect URL after successful payment
      cancel_url: "http://localhost:5173/", // Redirect URL if payment is canceled
    });

    newAppointment.paid = true;
    await newAppointment.save();

    const user = await User.findOne({ _id: req.body.doctorInfo.userId });

    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });

    await user.save();

    res.status(200).send({
      success: true,
      id: session.id,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
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
  getAllDocotrsController,
  getUserInfoController,
  bookAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfileController,
};
