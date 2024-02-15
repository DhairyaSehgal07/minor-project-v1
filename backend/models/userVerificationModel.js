import mongoose from "mongoose";

const userVerificationSchema = mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    mobileOtp: { type: String, default: "" },
    mobileOtpTimestamp: { type: Date, default: "" },
  },
  { timestamps: true }
);

const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

export default UserVerification;
