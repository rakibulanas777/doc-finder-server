const User = require("../models/Users");
const Doctor = require("../models/Doctor");

const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false, isDoctor: false });
    res.status(200).send({
      success: true,
      message: `users data`,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `error ${error.message}`,
    });
  }
};
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      success: true,
      message: `doctors data`,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `error ${error.message}`,
    });
  }
};
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });

    let user = await User.findOne({ _id: doctor.userId });

    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status} `,
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `error ${error.message}`,
    });
  }
};
module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
};
