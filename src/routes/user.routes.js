import { Router } from "express";
import {authMiddleware, isadmin} from "../middleware/auth.middleware.js";

import {
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
} from "../controllers/user.controllers.js";
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUserController);
router.route("/all-users").get(authMiddleware, isadmin,getallUsers);
router.route("/find-user/:id").get(findUser);
router.route("/delete-user/:id").delete(authMiddleware, isadmin,deleteUser);
router.route("/update-user/:id").put(authMiddleware, updateUser);
router.route("/block-user/:id").put(authMiddleware, isadmin, blockUser);
router.route("/unblock-user/:id").put(authMiddleware, isadmin, unblockUser);
router.route("/update-password/:id").put(authMiddleware, updatePassword);
router.route("/forgot-password").post(forgotPassword);
export default router;
