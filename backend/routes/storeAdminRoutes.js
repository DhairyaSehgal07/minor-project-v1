import express from "express";
const router = express.Router();
import { protectStoreAdmin } from "../middleware/authMiddleware.js";
import {
  registerStoreAdmin,
  loginStoreAdmin,
  logoutStoreAdmin,
  getStoreAdminProfile,
  updateStoreAdminProfile,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  createNewOrder,
  updateOrder,
  getAllOrders,
  deleteOrder,
} from "../controllers/storeAdminController.js";

// Authentication routes
router.post("/register", registerStoreAdmin);
router.post("/login", loginStoreAdmin);
router.post("/logout", logoutStoreAdmin);

router
  .route("/profile")
  .get(protectStoreAdmin, getStoreAdminProfile)
  .put(protectStoreAdmin, updateStoreAdminProfile);

//Feature routes
router.get("/users", protectStoreAdmin, getAllUsers);
router.get("/users/:id", protectStoreAdmin, getSingleUser);
router
  .route("/users/:id")
  .get(protectStoreAdmin, getSingleUser)
  .put(protectStoreAdmin, updateSingleUser)
  .delete(protectStoreAdmin, deleteSingleUser);

router.get("/orders", protectStoreAdmin, getAllOrders);
router
  .route("/orders/:id")
  .post(protectStoreAdmin, createNewOrder)
  .put(protectStoreAdmin, updateOrder)
  .delete(protectStoreAdmin, deleteOrder);
//create read update delete
export default router;
