import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to check JWT and authenticate user
export const requireSignIn = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get Authorization header
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized: Token not provided!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = decoded; // Add decoded payload to the request object
    next();
  } catch (err) {
    return res.status(403).send({
      success: false,
      message: "Forbidden: Invalid or expired token!",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    if (user.user_role === 1) {
      return next(); // Allow access if user is an admin
    }

    return res.status(403).send({
      success: false,
      message: "Unauthorized Access: Admin privileges required!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Server error in admin middleware.",
      error,
    });
  }
};
