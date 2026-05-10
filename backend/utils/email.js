import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"ServiceTrip" <${process.env.EMAIL_USER}>`, // Professional sender name
      to: email,
      subject: 'ServiceTrip - OTP Verification',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee">
          <h2>Your OTP is: <span style="color: #007bff;">${otp}</span></h2>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `
    });
    console.log("OTP sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error; // Re-throw to handle it in your route
  }
};

export{sendOTP}
