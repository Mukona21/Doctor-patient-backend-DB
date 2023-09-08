const mongoose = require("mongoose");

const APPOINTMENT_SCHEMA = mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    prenote: {//by patient
        type: String,
    },
    presciption: {//by doctor
        type: String,
    },
    cost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "upcoming",//"completed","cancelled"
    },
    rating: {
        type: Number,
    },
    review: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AppointmentModel = mongoose.model("Appointment", APPOINTMENT_SCHEMA);
module.exports = AppointmentModel;