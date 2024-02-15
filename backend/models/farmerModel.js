import mongoose from "mongoose";

const farmerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // registeredStoreAdmin: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "StoreAdmin",
    //   required: true,
    //   default: "",
    // },
    // transactions: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Transactions",
    //     default: "",
    //   },
    // ],
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
  },

  {
    timestamps: true,
  }
);

const Farmer = mongoose.model("farmers", farmerSchema);

export default Farmer;
