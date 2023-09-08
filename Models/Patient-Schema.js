const mongoose = require("mongoose");

const PATIENT_SCHEMA = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    onboarded: {
        type: Boolean,
        default: false,
    },
    imageURL: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    conditions: [{
        type: String,
    }],
    lookingfor: [{
        type: String,
    }],
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
    }],
    reviews: [{
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const PatientModel = mongoose.model("Patient", PATIENT_SCHEMA);
module.exports = PatientModel;