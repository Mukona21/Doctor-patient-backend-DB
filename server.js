require("dotenv").config();
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const rfs = require("rotating-file-stream");


//CONNECTING to MongoDB
const DB_URL = process.env.DB_URL;
const DB_Options = {
    useNewURLParser: true,
    useUnifiedTopology: true
}
mongoose.connect(DB_URL, DB_Options)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("ERROR: ", err))


//ALL ROUTES import
const authRouter = require("./Routes/Auth-Route");
const doctorRouter = require("./Routes/Doctor-Route");
const patientRouter = require("./Routes/Patient-Route");
const appointmentRouter = require("./Routes/Appointment-Route");

const app = express();
//MIddleWares
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));
// Logger to show logs in console 
app.use(morgan("dev"));
// add log stream to morgan to save logs in file
const stream = rfs.createStream("file.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip" // compress rotated files
});
app.use(morgan("dev", { stream }));


//Routes related USAGE
app.use("/auth", authRouter);
//custom Auth middleware for data protection
app.use("/doctor", authenticateRequest,doctorRouter);
app.use("/patient", authenticateRequest,patientRouter);
app.use("/appoint", authenticateRequest,appointmentRouter);

const httpServer = app.listen(process.env.PORT || 8000, () => {
    const port = httpServer.address().port;
    console.log(`Server running on ${port}`);
});


//AUTHORIZATION: custom middleware to prevent un-authorized access
function authenticateRequest(request, response, next) {
    const authHeaderInfo = request.headers["authorization"];
    if (authHeaderInfo == undefined) {
        return response.status(401).send("No token is provided!");
    }
    const token = authHeaderInfo.split(" ")[1];//Bearer <token>
    if (token == undefined) {
        return response.status(401).send("Proper token is NOT provided!");
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request.userInfo = payload;
        //console.log(request.userInfo);
        next();
    } catch (error) {
        return response.status(401).send("Invalid token provided! ERROR: " + error.message);
    }
}




//SOCKET_IO
const io = new Server(httpServer);
let allRooms = {};

io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);
    socket.emit("ID", socket.id);


    socket.on("disconnect", () => {
        console.log(`Client Disconnected: `, socket.id);
    });
})