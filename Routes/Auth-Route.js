const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DoctorModel = require("../Models/Doctor-Schema");
const PatientModel = require("../Models/Patient-Schema");

const router = express.Router();

//SIGN_UP-DOCTER
router.post("/doctor/signup", async (request, response) => {
    const { name, email, password, confirmPassword } = request.body;
    //Input Validation
    if (!name || !email || !password || !confirmPassword) {
        return response.status(400).json({ error: "All fields are REQUIRED!" });
    }
    if (password !== confirmPassword) {
        return response.status(400).json({ error: "Password & ConfirmPassword is not same!" });
    }
    const existingUser = await DoctorModel.findOne({ email: email });
    if (existingUser != null) {
        return response.status(409).json({ error: "Email already exists!" });
    }

    //DATA_PROCESS
    //Generate password HASH
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    //Create new user
    const newDOC = new DoctorModel({
        name,
        email,
        password: hash,
    })
    try {//Adding new user to Database
        const saveDOC = await newDOC.save();
        const payload = {
            id: saveDOC.id,
            email,
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME });

        return response.status(201).json({ saveUser: saveDOC, accessToken, refreshToken });
    } catch (error) {
        return response.status(501).send("ERROR: " + error.message);
    }
});

//SIGN_UP-PATIENT
router.post("/patient/signup", async (request, response) => {
    const { name, email, password, confirmPassword } = request.body;
    //Input Validation
    if (!name || !email || !password || !confirmPassword) {
        return response.status(400).json({ error: "All fields are REQUIRED!" });
    }
    if (password !== confirmPassword) {
        return response.status(400).json({ error: "Password & ConfirmPassword is not same!" });
    }
    const existingUser = await PatientModel.findOne({ email: email });
    if (existingUser != null) {
        return response.status(409).json({ error: "Email already exists!" });
    }

    //DATA_PROCESS
    //Generate password HASH
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    //Create new user
    const newPAT = new PatientModel({
        name,
        email,
        password: hash,
    })
    try {//Adding new user to Database
        const savePAT = await newPAT.save();
        const payload = {
            id: savePAT.id,
            email,
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME });

        return response.status(201).json({ saveUser:savePAT, accessToken, refreshToken });
    } catch (error) {
        return response.status(501).send("ERROR: " + error.message);
    }
});




//LOG_IN-DOCTOR
router.post("/doctor/login", async (request, response) => {
    const { email, password } = request.body;
    //Input Validation
    if (!email || !password) {
        return response.status(400).json({ error: "All fields are REQUIRED!" });
    }
    const existingDOC = await DoctorModel.findOne({ email: email });
    if (existingDOC == null) {
        return response.status(404).json({ error: "Email doesn't exist!" });
    }

    //Hashed Password compare
    const isPasswordCorrect = await bcrypt.compare(password, existingDOC.password);
    if (!isPasswordCorrect) {
        return response.status(401).json({ error: "Incorrect Password! try again..." });
    }
    const payload = {
        id: existingDOC.id,
        email: existingDOC.email
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME });

    return response.status(202).json({ accessToken, refreshToken, existingUser:existingDOC })
});

//LOG_IN-PATIENT
router.post("/patient/login", async (request, response) => {
    const { email, password } = request.body;
    //Input Validation
    if (!email || !password) {
        return response.status(400).json({ error: "All fields are REQUIRED!" });
    }
    const existingPAT = await PatientModel.findOne({ email: email });
    if (existingPAT == null) {
        return response.status(404).json({ error: "Email doesn't exist!" });
    }

    //Hashed Password compare
    const isPasswordCorrect = await bcrypt.compare(password, existingPAT.password);
    if (!isPasswordCorrect) {
        return response.status(401).json({ error: "Incorrect Password! try again..." });
    }
    const payload = {
        id: existingPAT.id,
        email: existingPAT.email
    }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME });

    return response.status(202).json({ accessToken, refreshToken, existingUser:existingPAT })
});


//Generate Access token from Refresh Token
router.post("/token", async (request, response) => {
    //Veryfying token received
    const refreshToken = request.body.token;
    if (!refreshToken) {
        return response.status(401).json({ error: "Please provide token!" })
    }
    //Generating Access token
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        delete payload.exp;
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME });
        return response.status(202).json({ accessToken });
    } catch (error) {
        return response.status(401).send("ERROR: " + error.message);
    }
});


module.exports = router;