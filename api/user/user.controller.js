const UserSchema = require('./user.model');
const TokenSchema = require('./owner.model');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  loginHelper(email, password, res);
}

exports.signup = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  signupHelper(email, password, res);
}

exports.serve = (req, res) => {
  return res.json({
    success: true
  });
}

exports.generateOtp = async (req, res) => {
  let email = req.body.email;
  if (!/^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/.test(email)) {
    return res.json({
      success: false,
      message: "check email"
    });
  }

  let otp = generateOTP();

  let profile = {
    email: email,
    otp: otp
  }

  try {
    let newOtp = new OtpSchema(profile);
    await newOtp.save();
    try {
      await sendEmail(profile.email, profile.otp);
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "problem during emailing"
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "problem during otp creation"
    });
  }
  return res.json({
    success: true,
    message: "email sent"
  });
}

exports.validateOtp = async (req, res) => {
  let email = req.body.email;
  if (!/^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/.test(email)) {
    return res.json({
      success: false,
      message: "check email"
    });
  }

  let otp = req.body.otp;

  let profile = {
    email: email,
    otp: otp
  }

  try {
    let otpUser = await OtpSchema.findOne({ email: email }).sort({ $natural: -1 }).limit(1);
    if (profile.otp !== otpUser.otp) {
      return res.json({
        success: false,
        message: "otp incorrect"
      });
    }
    else {
      let token = jwt.sign({ email: email }, config.secret);
      let successJson = {
        success: true,
        message: 'Authentication successful!',
        token: token
      };
      await OtpSchema.deleteMany({ email: email });
      return res.json(successJson);
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "some error"
    });
  }
}

async function signupHelper(email, password, res) {
  let alreadyPresent;
  try {
    alreadyPresent = await UserSchema.findOne({ email: email });
  } catch (err) {
    console.log(err)
  }
  if (alreadyPresent) {
    return res.json({
      success: false,
      message: 'Authorization failed! Some error'
    });
  } else {
    const saltRounds = 10;
    let passwordHash;
    try {
      passwordHash = await bcrypt.hash(password, saltRounds);
    } catch (err) {
      console.log(err);
    }
    let profile = {
      email: email,
      password: passwordHash
    };
    try {
      let newUser = new UserSchema(profile);
      let data = await newUser.save();
      return res.json({
        success: true,
        message: "User added"
      });
    } catch (err) {
      console.log(err);
    }
  }
}

async function loginHelper(email, password, res) {
  let alreadyPresent;
  let erro;
  try {
    alreadyPresent = await UserSchema.findOne({ email: email });
  } catch (err) {
    console.log(err)
    erro = err;
  }
  if (!erro) {
    let storedNumber = alreadyPresent.email;
    let storedPassword = alreadyPresent.password;
    let passwordsMatch;
    try {
      passwordsMatch = await bcrypt.compare(password, storedPassword);
    } catch (err) {
      console.log(err);
    }
    if (email === storedNumber && passwordsMatch) {
      let token = jwt.sign({ email: email }, config.secret);
      // return the JWT token for the future API calls
      let successJson = {
        success: true,
        message: 'Authentication successful!',
        token: token
      };
      try {
        let newTokenData = new TokenSchema({
          email: storedNumber,
          token: token
        });
        await newTokenData.save();
      } catch (err) {
        console.log(err);
      }
      console.log(successJson);
      return res.json(successJson);
    } else {
      return res.json({
        success: false,
        message: 'Incorrect email or password'
      });
    }
  }
}

function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

async function sendEmail(email, otp) {
  let password = require('../../config/email.config');
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "vit.concession@gmail.com",
      pass: password.emailPassword
    }
  });

  let info = await transporter.sendMail({
    from: '"Vidyalankar Institute of Technology" vit.concession@gmail.com',
    to: email,
    subject: "OTP for concession log in",
    text: "OTP: " + otp
  });

  console.log("Message sent: %s", info.messageId);
}

