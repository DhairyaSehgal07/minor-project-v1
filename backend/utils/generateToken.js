import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Handle the error appropriately, e.g., log it or respond with a 500 status
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default generateToken;
