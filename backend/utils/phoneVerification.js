import Farmer from "../models/farmerModel.js";
import twilio from "twilio";
import UserVerification from "../models/userVerificationModel.js";
import { z } from "zod";

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const mobileSchema = z.object({
  mobileNumber: z.string().length(10),
});

const otpSchema = z.object({
  mobileNumber: z.string().length(10),
  enteredOtp: z.string().length(4),
});

const sendOtp = async ({ mobileNumber, otp }) => {
  try {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);

    const messageBody = `Your mobile verification otp is ${otp}`;
    const phoneNumber = `+91${mobileNumber}`;

    // Send message
    // const message = await client.messages.create({
    //   body: messageBody,
    //   from: twilioPhoneNumber,
    //   to: phoneNumber,
    // });
    console.log(messageBody);
  } catch (err) {
    console.error(err); // Log the error for debugging
    throw new Error("Failed to send OTP"); // Throw the error to be caught by the caller
  }
};

const mobileOtpHandler = async (req, res) => {
  try {
    mobileSchema.parse(req.body);
    const { mobileNumber } = req.body;
    const otp = generateOTP();

    // Generate otp and store it in user verification db
    const userMobileVerification = await UserVerification.create({
      mobileNumber,
      mobileOtp: otp,
    });

    if (userMobileVerification) {
      // Send otp via twilio
      await sendOtp({ mobileNumber, otp });
      res.status(200).json({
        status: "Success",
        message: `added credentials in user verification , and otp sent to +91 ${mobileNumber}`,
      });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      status: "Fail",
      message: "Some error occurred. Please try again.",
    });
  }
};

const verifyFarmerMobile = async (req, res) => {
  try {
    otpSchema.parse(req.body);
    const { mobileNumber, enteredOtp } = req.body;
    const verifyUser = await UserVerification.findOne({ mobileNumber });

    if (!verifyUser) {
      return res.status(404).json({
        status: "Fail",
        message: "User verification record not found",
      });
    }

    if (verifyUser.mobileOtp === enteredOtp) {
      // Update user verification status
      const user = await Farmer.findOne({ mobileNumber });
      if (!user) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found",
        });
      }
      user.isVerified = true;
      await user.save();

      // Delete document from UserVerification collection
      await verifyUser.deleteOne();

      return res.status(200).json({
        status: "Success",
        message: "Mobile verified successfully",
      });
    } else {
      return res.status(400).json({
        status: "Fail",
        message: "Incorrect OTP",
      });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({
      status: "Fail",
      message: "Some error occurred while verifying OTP",
    });
  }
};

export { mobileOtpHandler, verifyFarmerMobile };
