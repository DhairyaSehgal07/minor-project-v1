import asyncHandler from "express-async-handler";
import StoreAdmin from "../models/storeAdminModel.js";
import generateToken from "../utils/generateToken.js";
import Farmer from "../models/farmerModel.js";
import Order from "../models/orderModel.js";

//////////Authentication Routes///////////////////////
//@desc Register storeAdmin
//route POST /api/store-admin/register
//@access Public
const registerStoreAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const storeAdminExists = await StoreAdmin.findOne({ email });

  if (storeAdminExists) {
    res.status(400);
    throw new Error("storeAdmin already exists");
  }

  const storeAdmin = await StoreAdmin.create({
    name,
    email,
    password,
  });

  if (storeAdmin) {
    generateToken(res, storeAdmin._id);
    res.status(201).json({
      id: storeAdmin._id,
      name: storeAdmin.name,
      email: storeAdmin.email,
      password: storeAdmin.password,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc login storeAdmin
//route POST/api/store-admin/login
//@access Public
const loginStoreAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const storeAdmin = await StoreAdmin.findOne({ email });

  if (storeAdmin && (await storeAdmin.matchPassword(password))) {
    generateToken(res, storeAdmin._id);
    res.status(200).json({
      id: storeAdmin._id,
      name: storeAdmin.name,
      email: storeAdmin.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc logout storeAdmin
//route POST/api/store-admin/logout
//@access Public

const logoutStoreAdmin = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "User logged out",
  });
});

//@desc gets the logged in storeAdmin's profile
//route GET/api/store-admin/profile
//@access Private

const getStoreAdminProfile = asyncHandler(async (req, res) => {
  const storeAdmin = {
    _id: req.storeAdmin._id,
    name: req.storeAdmin.name,
    email: req.storeAdmin.email,
  };
  res.status(200).json(storeAdmin);
});

//@desc Updates the logged in storeAdmin's profile
//route PUT/api/store-admin/profile
//@access Private

const updateStoreAdminProfile = asyncHandler(async (req, res) => {
  const storeAdmin = await StoreAdmin.findById(req.storeAdmin._id);

  if (storeAdmin) {
    storeAdmin.name = req.body.name || storeAdmin.name;
    storeAdmin.address = req.body.address || storeAdmin.address;
    storeAdmin.email = req.body.email || storeAdmin.email;

    if (req.body.password) {
      storeAdmin.password = req.body.password;
    }

    const updatedStoreAdmin = await storeAdmin.save();

    res.status(200).json({
      _id: updatedStoreAdmin._id,
      name: updatedStoreAdmin.name,
      email: updatedStoreAdmin.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

////////////////////// Feature controllers //////////////////////
//@desc gets all the farmers registered with the signed in storeAdmin
//route GET/api/store-admin/users
//@access Private

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Fetch all farmers associated with the loggedIn storeAdmin
    const farmers = await Farmer.find({
      registeredStoreAdmin: req.storeAdmin.email,
    }).populate("orders");

    if (!farmers || farmers.length === 0) {
      res.status(404);
      throw new Error("No farmers found for the loggedIn storeAdmin");
    }

    // Extract relevant fields from each farmer and their orders
    const farmersWithOrders = farmers.map((farmer) => {
      const { _id, name, address, phone, email, registeredStoreAdmin, orders } =
        farmer;

      return {
        _id,
        name,
        address,
        phone,
        email,
        registeredStoreAdmin,
        orders,
      };
    });

    res.status(200).json({
      status: "Success",
      data: farmersWithOrders,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

//@desc gets the farmer whose id is passed in the url
//route GET/api/store-admin/users/:id
//@access Private
const getSingleUser = asyncHandler(async (req, res) => {
  const farmerId = req.params.id;

  try {
    // Fetch the single farmer by ID along with their orders
    const farmer = await Farmer.findById(farmerId).populate("orders");

    if (!farmer) {
      res.status(404);
      throw new Error("Farmer not found");
    }

    const { _id, name, address, phone, email, registeredStoreAdmin, orders } =
      farmer;

    const farmerProfile = {
      _id,
      name,
      address,
      phone,
      email,
      registeredStoreAdmin,
      orders,
    };

    res.status(200).json({
      status: "Success",
      data: farmerProfile,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

// update and delete user

const updateSingleUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "User updated successfuly",
  });
});

const deleteSingleUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "User deleted successfuly",
  });
});

//@desc creates a new order, for the farmer whose id is passed in the url
//@route POST/create-order/:farmerId
// Private

function formatDate(inputDate) {
  const currentDate = new Date(inputDate);

  const dd = String(currentDate.getDate()).padStart(2, "0");
  const mm = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    currentDate
  );
  const yy = String(currentDate.getFullYear()).slice(2);

  return `${dd} ${mm}, 20${yy}`;
}

const createNewOrder = asyncHandler(async (req, res) => {
  const { crop, quantity } = req.body;
  const farmerId = req.params.id;

  try {
    // Check if the farmer with the provided ID exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        status: "Error",
        message: "Farmer not found.",
      });
    }

    // Create a new order
    const order = await Order.create({
      farmer: farmer, // Set the farmer field with the farmer object
      crop,
      quantity,
      date: formatDate(Date.now()),
    });

    // Update the farmer's orders array
    farmer.orders.push(order._id);
    await farmer.save();

    res.status(201).json({
      status: "Success",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error.",
    });
  }
});

//@des GET all orders from the orders db
//@route GET/store-admin/orders
//Private

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      status: "Success",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
});

//@desc Updates an existing order for the farmer whose id is passed in the url
//@route PUT/update-order/:orderId
// Private
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.crop = req.body.crop || order.crop;
      order.quantity = req.body.quantity || order.quantity;
      order.date = formatDate(Date.now()); // Corrected from 'data' to 'date'

      await order.save(); // Corrected from 'Order.save()' to 'order.save()'

      res.status(200).json({
        status: "Success",
        data: order,
      });
    } else {
      // If the order is not found
      res.status(404).json({
        status: "Fail",
        message: "Order not found.",
      });
    }
  } catch (err) {
    // General error handling
    res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
});

//@desc deletes the order whose id is passed in the url
//@route DELETE/store-admin/orders
//@access Private
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    // Find the order by ID
    const order = await Order.findByIdAndDelete(req.params.id);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        status: "Fail",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Order deleted successfully",
    });
  } catch (err) {
    // Handle other errors
    res.status(500).json({
      status: "Fail",
      message: err.message,
    });
  }
});

export {
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
  getAllOrders,
  updateOrder,
  deleteOrder,
};
