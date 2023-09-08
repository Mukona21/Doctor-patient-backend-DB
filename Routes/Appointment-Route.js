const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DoctorModel = require("../Models/Doctor-Schema");
const PatientModel = require("../Models/Patient-Schema");
const AppointmentModel = require("../Models/Appointment-Schema");
const multer = require("multer");
const router = express.Router();


//create a new Appointment 
router.post("/new", async (request, response) => {
    const { doctor, patient, date, time, prenote } = request.body;
    console.log(request.body)
    try {
        //check if patient has any other Appointment at the same date & time

        const existingAppointments = await PatientModel.find({ _id: patient }, { appointments: true });
        let foundDuplicate = false;
        for (let i = 0; i < existingAppointments[0].appointments.length; i++) {
            let currAppoint = existingAppointments[0].appointments[i];
            if (currAppoint.date === date && currAppoint.time === time) {
                foundDuplicate = true;
                break;
            }
        }


        //get doctor fee
        const doctorFee = await DoctorModel.find({ _id: doctor }, { fee: true });
        const cost = doctorFee[0].fee;
        //creating document 
        const newAppointment = new AppointmentModel({
            doctor,
            patient,
            date,
            time,
            prenote,
            cost,
        });

        if (!foundDuplicate) {
            const saveAppointment = await newAppointment.save();
            await PatientModel.updateOne({ _id: patient }, {
                $push: {
                    "appointments": saveAppointment.id,
                }
            });
            await DoctorModel.updateOne({ _id: doctor }, {
                $push: {
                    "appointments": saveAppointment.id,
                }
            });
            return response.status(200).json({ message: `Appointment Booked with ID: ${saveAppointment.id}` })
        } else {
            return response.status(400).json({ error: "Already have an Appointment booked at same timeline!" })
        }

    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})


// get all patient Appointment
router.get("/patient/:id", async (request, response) => {
    const patientID = request.params.id;
    try {
        let appointments = await AppointmentModel.find({ patient: patientID })
            .populate("doctor", "name imageURL")
            .populate("patient", "name  imageURL");
        return response.status(200).json(appointments)
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})


// get all doctor Appointment 
router.get("/doctor/:id", async (request, response) => {
    const doctorID = request.params.id;
    try {
        let appointments = await AppointmentModel.find({ doctor: doctorID })
            .populate("doctor", "name imageURL")
            .populate("patient", "name  imageURL");
        return response.status(200).json(appointments)
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})


//Complete an Appointment By DOCtor
router.post("/complete/:id", async (request, response) => {
    let { presciption } = request.body;
    const appointID = request.params.id;
    try {
        await AppointmentModel.updateOne({ _id: appointID }, {
            "status": "completed",
            "presciption": presciption,
        });
        return response.status(200).json({ message: "Appointment Completed with ID: " + appointID })
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})


//Review an Appointment By PATient
router.post("/review/:id", async (request, response) => {
    let { rating, review } = request.body;
    const appointID = request.params.id;
    try {
        await AppointmentModel.updateOne({ _id: appointID }, {
            "rating": rating,
            "review": review,
            "status": "completed",
        });
        let currAppoint = await AppointmentModel.find({ _id: appointID }, { doctor: true });
        let currDocID = await currAppoint[0].doctor;
        let currDoc = await DoctorModel.find({ _id: currDocID }, { rating: true, reviews: true });
        let currRating = await currDoc[0].rating;
        let currReview = await currDoc[0].reviews;
        //console.log(currDoc[0]);
        await DoctorModel.updateOne({ _id: currDoc }, {
            "rating": ((rating + (currRating * currReview.length)) / (currReview.length + 1)).toFixed(2),
            $push: {
                "reviews": review,
            }
        });
        return response.status(200).json({ message: "Appointment Reviewed with ID: " + appointID })
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})




//Cancel an Appointment
router.post("/cancel/:id", async (request, response) => {
    const appointID = request.params.id;
    try {
        await AppointmentModel.updateOne({ _id: appointID }, {
            "status": "canceled",
        });
        return response.status(200).json({ message: "Appointment Canceled with ID: " + appointID })
    } catch (error) {
        return response.status(400).json({ error: error.message })
    }
})



module.exports = router;