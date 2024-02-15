import asyncHandler from "express-async-handler";
import Farmer from "../models/farmerModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import { z } from "zod";

const farmerSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
  mobileNumber: z.string().length(10),
  password: z.string().min(6),
});

const loginSchema = z.object({
  mobileNumber: z.string().length(10),
  password: z.string().min(6),
});

/////////AUTHENTICATION ROUTES //////////////////////
//@desc Register farmer
//route POST/api/farmers/register
//@access Public
const registerFarmer = asyncHandler(async (req, res) => {
  try {
    // Validate the request body data against the defined schema
    farmerSchema.parse(req.body);

    const { name, address, mobileNumber, password } = req.body;

    const farmerExists = await Farmer.findOne({ mobileNumber });

    if (farmerExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = await Farmer.create({
      name,
      address,
      mobileNumber,
      password: hashedPassword,
    });

    if (farmer) {
      generateToken(res, farmer._id);
      res.status(201).json({
        id: farmer._id,
        name: farmer.name,
        address: farmer.address,
        phone: farmer.phone,
        password: farmer.password,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc authenticates a farmer
//@route POST/api/farmer/login
//@access Public
const loginFarmer = asyncHandler(async (req, res) => {
  try {
    loginSchema.parse(req.body);
    const { mobileNumber, password } = req.body;

    const farmer = await Farmer.findOne({ mobileNumber });

    if (farmer) {
      const isPasswordMatch = await bcrypt.compare(password, farmer.password);

      if (isPasswordMatch) {
        generateToken(res, farmer._id);
        return res.status(200).json({
          _id: farmer._id,
          name: farmer.name,
          mobileNumber: farmer.mobileNumber,
        });
      }
    }
    res.status(401);
    throw new Error("Invalid mobile number or password");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc logout farmer
//route POST/api/farmers/logout
//@access Public
const logoutFarmer = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "User logged out",
  });
});

//@desc Gets the logged in farmer's profile
//route GET/api/farmers/profile
//@access Private
const getFarmerProfile = asyncHandler(async (req, res) => {
  const farmerId = req.farmer._id;

  const farmer = await Farmer.findById(farmerId);

  if (farmer) {
    const { _id, name, address, mobileNumber } = farmer;

    const farmerProfile = {
      _id,
      name,
      address,
      mobileNumber,
    };

    res.status(200).json(farmerProfile);
  }

  res.status(404);
  throw new Error("Farmer not found");
});

//@desc Updates the logged in farmer's profile
//route PUT/api/farmers/profile
//@access Private
const updateFarmerProfile = asyncHandler(async (req, res) => {
  try {
    // Validate the request body data against the defined schema
    farmerSchema.parse(req.body);

    const farmer = await Farmer.findById(req.farmer._id);

    if (farmer) {
      farmer.name = req.body.name || farmer.name;
      farmer.address = req.body.address || farmer.address;
      farmer.mobileNumber = req.body.mobileNumber || farmer.mobileNumber;

      if (req.body.password) {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        farmer.password = hashedPassword;
      }

      const updatedFarmer = await farmer.save();

      res.status(200).json({
        _id: updatedFarmer._id,
        name: updatedFarmer.name,
        address: updatedFarmer.address,
        mobileNumber: updatedFarmer.mobileNumber,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export {
  registerFarmer,
  loginFarmer,
  logoutFarmer,
  getFarmerProfile,
  updateFarmerProfile,
};
