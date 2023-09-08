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


//ONBOARD-PAT
router.post('/onboard', upload.single('image'), async (request, response) => {
    const { email, age, gender, conditions, lookingfor, city, country } = request.body;
    let imageUrl = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80";//generic image
    let uploadedFile = request.file;
    if (uploadedFile != undefined) {
        uploadedFile = uploadedFile.filename;
        uploadedFile = 'uploads/' + uploadedFile;
        imageUrl = process.env.BASE_URL + uploadedFile;
    }
    //console.log(process.env.BASE_URL);
    //console.log(imageUrl);
    //console.log(request.body);
    let conditionsArr = JSON.parse(conditions);
    let lookingforArr = JSON.parse(lookingfor);
    //console.log(conditionsArr);
    //console.log(lookingforArr);
    if (!age || !gender || !conditions || !lookingfor || !city || !country) {
        return response.status(400).json({ error: 'Input required!' });
    }
    try {
        await PatientModel.updateOne({ email: email }, {
            "age": age,
            "gender": gender,
            "conditions": conditionsArr,
            "lookingfor": lookingforArr,
            "city": city,
            "country": country,
            "imageURL": imageUrl,
            "onboarded": true,
            "appointments": [],
            "doctors": [],
            "reviews": [],
        });
        const PAT = await PatientModel.find({ email: email })
        return response.status(201).json(PAT);
    } catch (e) {
        return response.status(501).json({ error: e.message })
    }
});



module.exports = router;