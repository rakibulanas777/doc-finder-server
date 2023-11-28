const Doctor = require("../models/Doctor");
const appointmentModel = require("../models/appointmentModel");
const User = require("../models/Users");
const stripe = require("stripe")(
  "sk_test_51LM2J1SIiDyURhxDcwcDsr2pkYCLeu8MVqvXDNb5Dgap0qkfEBn1O8H0GHos3NHaS68eWsR1ocBhbniPOLgHG5AL00WDJsrnCf"
);
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
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

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await User.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    await doctor.save();

    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

//get single docotor
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    await doctor.calculateReviewsAndRating();
    res.status(200).send({
      success: true,
      message: "Sigle Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single docot info",
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const val = req.query.status;
    console.log(val);
    const doctor = await Doctor.findOne({ userId: req.body.userId });

    if (val === "all") {
      const appointments = await appointmentModel
        .find({
          doctorId: doctor._id,
        })
        .populate("userId")
        .populate("doctorInfo")
        .sort({ createdAt: -1 });

      let totalAppointments = appointments.length;
      let totalRevenue = 0;
      // console.log(appointments);
      if (totalAppointments > 0) {
        totalRevenue = appointments.reduce((acc, appointment) => {
          return acc + appointment.doctorInfo.feesPerConsaltation;
        }, 0);
      }

      res.status(200).send({
        success: true,
        message: "Doctor Appointments fetch Successfully",
        data: appointments,
        totalAppointments,
        totalRevenue,
      });
    } else {
      const appointments = await appointmentModel
        .find({
          doctorId: doctor._id,
          status: val,
        })
        .populate("userId")
        .populate("doctorInfo")
        .sort({ createdAt: -1 });
      let totalAppointments = appointments.length;
      let totalRevenue = 0;
      // console.log(appointments);
      if (totalAppointments > 0) {
        totalRevenue = appointments.reduce((acc, appointment) => {
          return acc + appointment.doctorInfo.feesPerConsaltation;
        }, 0);
      }

      res.status(200).send({
        success: true,
        message: "Doctor Appointments fetch Successfully",
        data: appointments,
        totalAppointments,
        totalRevenue,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};
const revenueController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });

    const appointments = await appointmentModel
      .find({
        doctorId: doctor._id,
      })
      .populate("userId")
      .populate("doctorInfo")
      .sort({ createdAt: -1 });

    let totalAppointments = appointments.length;
    let totalRevenue = 0;
    // console.log(appointments);
    if (totalAppointments > 0) {
      totalRevenue = appointments.reduce((acc, appointment) => {
        return acc + appointment.doctorInfo.feesPerConsaltation;
      }, 0);
    }

    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      totalAppointments,
      totalRevenue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await User.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

// markCompleteController.js

const markCompleteController = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "complete" },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointment Marked as Complete",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Marking Appointment as Complete",
    });
  }
};

const getApprovedAppointmentsController = async (req, res) => {
  try {
    const doctorId = req.body.id; // Assuming you have the doctor's ID in the user object
    const approvedAppointments = await appointmentModel.find({
      doctorId: doctorId,
      status: "approved",
    });

    res.status(200).send({
      success: true,
      message: "Approved Appointments Fetched Successfully",
      data: approvedAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Fetching Approved Appointments",
    });
  }
};

module.exports = getApprovedAppointmentsController;

module.exports = {
  getDoctorInfoController,
  getApprovedAppointmentsController,
  updateProfileController,
  getDoctorByIdController,
  updateStatusController,
  revenueController,
  markCompleteController,
  doctorAppointmentsController,
};
