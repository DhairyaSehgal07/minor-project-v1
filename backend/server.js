import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import farmerRouter from "./routes/farmerRoutes.js";
import storageOwnerRouter from "./routes/storeAdminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
const port = process.env.PORT || 5000;

app.use("/api/farmers", farmerRouter);
//app.use("/api/store-admin", storageOwnerRouter);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
