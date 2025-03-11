import User from "../models/user.models.js";
import expressAsyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import validateMongodbId from "../utils/validateMongodbId.js";
import { sendEmail } from "./email.controllers.js";
const generateToken = (userID) => {
  try {
    return jwt.sign({ userID }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
  } catch (error) {
    throw new ApiError(500, "Failed to generate token");
  }
};

const generateRefreshToken = expressAsyncHandler(async (userID) => {
  try {
    return jwt.sign({ userID }, process.env.TOKEN_SECRET, { expiresIn: "3d" });
  } catch (error) {
    throw new ApiError(500, "Failed to generate token");
  }
});

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const user = await User.findOne({ email });
  if (user) {
    // Throw a custom error using ApiError

    throw new ApiError(409, "User already exists");
  }
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Create the new user
  const newUser = await User.create({
    name,
    email,
    password,
  });

  // Send the response
  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
  });
});

const loginUserController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if password is valid
  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate refresh token and update user
  const refreshToken = await generateRefreshToken(user._id);
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true }
  );

  // Set refresh token as an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 72 * 60 * 60 * 1000, // 72 hours
  });

  // Respond with success message, user data, and access token
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      name: user.name, // Adjust properties as needed
    },
    token: generateToken(user._id),
  });
});


const getallUsers = expressAsyncHandler(async (req, res) => {
  try {
    const allUSers = await User.find();
    res.status(200).json({
      message: "All users",
      allUSers,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to get all users");
  }
});

const findUser = expressAsyncHandler(async (req, res) => {
  console.log(req.params.id);
  validateMongodbId(req.params.id);
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to find user");
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  // console.log(req.params.id);
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to delete user");
  }
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Update fields conditionally
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    // Hash password if it needs updating

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Forward errors for centralized error handling
    throw new ApiError(
      error.status || 500,
      error.message || "Failed to update user"
    );
  }
});
const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.status(200).json({
      message: "User blocked successfully",
      user,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to block user");
  }
});

const unblockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: false }
    );
    res.status(200).json({
      message: "User unblocked successfully",
      user,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to unblock user");
  }
});

const updatePassword = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try { 
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.password = password;
    await user.save();
    res.status(200).json({
      message: "Password updated successfully",
      user
    })
  } 
  catch (error) {
    throw new ApiError(500, "Failed to update password");
  }
})
const forgotPassword = expressAsyncHandler(async (req, res) => {
   const { email } = req.body;
   
   try{
     const user = await User.findOne({email});
     if(!user){
       throw new ApiError(404, "User not found");
     }
     const token = await user.createPasswordResetToken();
     await user.save();
     const resetUrl = `hi, follow this link to reset your password <a href='http://localhost:3000/reset-password/${token}'>click here</a>`;
     const data = {
       to : email,
       subject: "Forgot Password link",
       text: "hey user",
       html: resetUrl,
     }
     sendEmail(data);
     res.status(200).json({
      message: "Email sent successfully",
     })
   } catch(error){
     throw new ApiError(500, error.message || "Failed to generate token");
   }
})
const resetPassword = expressAsyncHandler(async (req, res) => {

})
export {
  registerUser,
  loginUserController,
  getallUsers,
  findUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  updatePassword,
  forgotPassword
};
