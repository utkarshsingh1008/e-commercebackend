import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import expressAsyncHandler from "express-async-handler";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized: Missing or invalid token");
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(401, "Unauthorized: Invalid token");
    }

    // Check if user exists in the database
    const user = await User.findById(decodedToken.userID);
    if (!user) {
      throw new ApiError(401, "Unauthorized: User does not exist");
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      // If it's an API Error, pass it to the next middleware
      next(error);
    } else {
      // For unexpected errors
      next(new ApiError(500, "Internal server error"));
    }
  }
};

const isadmin = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    throw new ApiError(401, "Unauthorized: User is not an admin");
  } else {
    next();
  }
});
export { authMiddleware, isadmin };

