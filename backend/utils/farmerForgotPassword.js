import Farmer from "../models/farmerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import twilio from "twilio";
import { z } from "zod";

const forgotPassSchema = z.object({
  mobileNumber: z.string().length(10),
});

const updatePassSchema = z.object({
  newPassword: z.string().min(6),
});

const sendFarmerOtp = async ({ mobileNumber, userId }) => {
  try {
    // Generate JWT token with expiry
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Find user by mobile number
    const user = await Farmer.findOne({ mobileNumber });

    if (user) {
      // Update user document with token and expiry
      user.forgotPasswordToken = token;
      user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour expiry
      await user.save(); // Save the updated user document
    } else {
      throw new Error("User not found");
    }

    // Initialise Twilio client
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);

    // Create message body with reset password link
    const messageBody = ` Reset your password by clicking here:  ${process.env.FARMER_DOMAIN}/reset-password?token=${token}`;

    const phoneNumber = `+91${mobileNumber}`;

    // Send message
    // const message = await client.messages.create({
    //   body: messageBody,
    //   from: twilioPhoneNumber,
    //   to: phoneNumber,
    // });

    console.log(messageBody);
  } catch (err) {
    throw new Error(err.message);
  }
};

const farmerForgotPassword = asyncHandler(async (req, res) => {
  try {
    forgotPassSchema.parse(req.body);
    // If validation succeeds, continue with your logic
    const { mobileNumber } = req.body;
    const user = await Farmer.findOne({ mobileNumber });

    if (user) {
      await sendFarmerOtp({ mobileNumber, userId: user._id });

      res.status(200).json({
        status: "Success",
        message: `Otp has been sent to ${mobileNumber}`,
      });
    } else {
      res.status(404).json({
        status: "Fail",
        message: "User not found. Please try signing up.",
      });
    }
  } catch (error) {
    // If validation fails, handle the error
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
});

const resetFarmerPasswordForm = async (req, res) => {
  const { token } = req.query;

  try {
    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extract userId from the decoded token
    const { userId } = decodedToken;

    // Find the user in the database using userId
    const user = await Farmer.findOne({ _id: userId });

    if (user) {
      // If user is found, return it
      res.render("reset");
    } else {
      // If user is not found, return a 404 response
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // If there's an error decoding the token or querying the user, return a 500 response
    console.error("Error finding user by token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//@desc PUT request to reset the password
// PUT/api/farmers/resetpassword
//@access Private
const updateFarmerPassword = asyncHandler(async (req, res) => {
  try {
    updatePassSchema.parse(req.body);
    const { token } = req.query;
    const { newPassword } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // extract the userId from the decoded token
    const { userId } = decodedToken;

    // find the user in the db using userId
    const user = await Farmer.findOne({ _id: userId });
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;

      await user.save();
      res.status(200).json({
        status: "Success",
        message: "Password updated!",
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error finding the user by token" });
  }
});

const successPage = (req, res) => {
  res.render("success");
};

export {
  farmerForgotPassword,
  resetFarmerPasswordForm,
  updateFarmerPassword,
  successPage,
};
