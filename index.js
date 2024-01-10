import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import twilio from "twilio";
import mongoose from "mongoose";
import dotenv from 'dotenv';

// confuring the .env file
dotenv.config();


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

var username1 = "";
var otpEmail = "";
var otpSms = "";
var usercode = "";
var userInput = "";

// conection mogodb
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => console.log("mongodb conected"))
  .catch((err) => console.log(err));

//creating shcema
const registrationSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
    },

    phoneNumber: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true }
);

//model
const user = mongoose.model("Registration", registrationSchema);

// setting properties for email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.emailPassword,
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// for sending code to user email or phone no
app.post("/validation", (req, res) => {
  userInput = req.body.email;
  otpEmail = Math.floor(Math.random() * 9000) + 1000;
  username1 = req.body.username;

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput)) {
    const mailOptions = {
      from: process.env.email,
      to: userInput,
      subject: "code for email verification",
      text: `Your code is: ${otpEmail}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      }
      console.log("Email sent:", info.response);
    });

    res.sendFile(__dirname + "/public/validation.html");
  } else if (/^\d+$/.test(userInput)) {
    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    userInput = req.body.email;
    const client = twilio(accountSid, authToken);

    otpSms = Math.floor(Math.random() * 9000) + 1000;

    client.messages
      .create({
        body:
          "Hello, this is a message from Valuable Eats Marketplace for OTP verification! Your OTP is: " +
          otpSms,
        from: process.env.twilioNo,
        to: "+91" + userInput,
      })

      .then((message) => console.log("Message SID:", message.sid))
      .catch((error) => console.error("Error sending SMS:", error));

    res.sendFile(__dirname + "/public/validation.html");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

//for validation of user entered code
app.post("/home", (req, res) => {
  usercode = req.body.usercode;
  // Handle email verification
  if (usercode == otpEmail) {
  
   res.render("home.ejs", {name1:username1})

    // inserting records
    user.create({
      userName: username1,
      email: userInput,
    });

    const mailOptions = {
      from: process.env.email,
      to: userInput,
      subject: "email verification done successfully",
      text: `hello, ${username1}, your account is verified successfully`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
      }
      console.log("Email sent:", info.response);
    });
    res.sendFile(__dirname + "home.ejs");
  } 

  // Handle sms verification
  else if (usercode == otpSms) {

    res.render("home.ejs", {name1:username1})

    //inserting records
    user.create({
      userName: username1,
      phoneNumber: parseInt(userInput),
    });

    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    const client = twilio(accountSid, authToken);

    client.messages
      .create({
        body: `hello from Valuable Eats Marketplace, ${username1}, your account is verified successfully`,
        from: process.env.twilioNo,
        to: "+91" + userInput,
      })

      .then((message) => console.log("Message SID:", message.sid))
      .catch((error) => console.error("Error sending SMS:", error));
    
     
     res.sendFile(__dirname + "home.ejs");
  } else {
    res.sendFile(__dirname + "/public/index.html");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});