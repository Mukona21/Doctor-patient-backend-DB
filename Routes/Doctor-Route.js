const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DoctorModel = require("../Models/Doctor-Schema");
const PatientModel = require("../Models/Patient-Schema");
const AppointmentModel = require("../Models/Appointment-Schema");
const multer = require("multer");
const router = express.Router();


const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, "public/uploads")
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + Math.random().toString(32).slice(2, 13) + "-" + file.originalname)
        }
    }
);

const upload = multer({ storage: storage });


//ONBOARD-DOC
router.post('/onboard', upload.single('image'), async (request, response) => {
    const { email, time, days, qualification, speciality, hospital, experience, fee, city, country } = request.body;
    let imageUrl = "https://images.unsplash.com/photo-1590611936760-eeb9bc598548?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";//generic image
    let uploadedFile = request.file;
    if (uploadedFile != undefined) {
        uploadedFile = uploadedFile.filename;
        uploadedFile = 'uploads/' + uploadedFile;
        imageUrl = process.env.BASE_URL + uploadedFile;
    }
    //console.log(process.env.BASE_URL);
    //console.log(request.body);
    let daysArr = JSON.parse(days);
    let timeArr = JSON.parse(time);
    //console.log(daysArr);
    //console.log(timeArr);
    if (!time || !days || !qualification || !speciality || !experience || !fee || !hospital || !city || !country) {
        return response.status(400).json({ error: 'Input required!' });
    }
    try {
        await DoctorModel.updateOne({ email: email }, {
            "time": timeArr,
            "days": daysArr,
            "qualification": qualification,
            "speciality": speciality,
            "hospital": hospital,
            "experience": experience,
            "fee": fee,
            "city": city,
            "country": country,
            "imageURL": imageUrl,
            "onboarded": true,
            "rating": 5,
            "appointments": [],
            "patients": [],
            "reviews": [],
        });
        const DOC = await DoctorModel.find({ email: email })
        return response.status(201).json(DOC);
    } catch (e) {
        return response.status(501).json({ error: e.message })
    }
});


//SHOW all DOC
router.get('/all', async (request, response) => {
    const DOC = await DoctorModel.find({})
        .populate("appointments")
        .populate("patients", "name")

    response.status(200).json(DOC);
});


//SHOW a DOC
router.get('/:id', async (request, response) => {
    const docID = request.params.id;
    const DOC = await DoctorModel.find({_id:docID})
        .populate("appointments")
        .populate("patients", "name")

    response.status(200).json(DOC);
});


//SHOW DOC by city
router.get('/city/:city', async (request, response) => {
    const cityID = request.params.city;
    const DOC = await DoctorModel.find({ city: cityID })
        .populate("appointments")
        .populate("patients", "name")

    response.status(200).json(DOC);
});


//SHOW DOC by speciality
router.get('/speciality/:speciality', async (request, response) => {
    const specialityID = request.params.speciality;
    const DOC = await DoctorModel.find({ speciality: specialityID })
        .populate("appointments")
        .populate("patients", "name")

    response.status(200).json(DOC);
});


//SHOW DOC by name
router.get('/name/:name', async (request, response) => {
    const nameID = request.params.name;
    const DOC = await DoctorModel.find({ name: nameID })
        .populate("appointments")
        .populate("patients", "name")

    response.status(200).json(DOC);
});






module.exports = router;