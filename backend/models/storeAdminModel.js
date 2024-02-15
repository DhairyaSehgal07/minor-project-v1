import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const storeAdminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

storeAdminSchema.pre("save", async function (next) {
  //here the this keyword means StoreAdmin.create in controller
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

storeAdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const StoreAdmin = mongoose.model("storeAdmin", storeAdminSchema);
export default StoreAdmin;
