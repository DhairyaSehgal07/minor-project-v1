import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Farmer from "../models/farmerModel.js ";
import StoreAdmin from "../models/storeAdminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.farmer = await Farmer.findById(decoded.userId).select("--password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized , invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized , no token");
  }
});

const protectStoreAdmin = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.storeAdmin = await StoreAdmin.findById(decoded.userId).select(
        "--password"
      );

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized , invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized , no token");
  }
});

export { protect, protectStoreAdmin };
