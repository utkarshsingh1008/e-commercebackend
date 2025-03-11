
import { Router } from "express";
import { isadmin, authMiddleware } from "../middleware/auth.middleware.js";
import { createCategory, updateCategory,deleteCategory, getCategory, getAllCategory } from "../controllers/category.controllers.js";

const router = Router();

router.route("/createcategory").post(createCategory);
router.route("/updatecategory/:id").put(updateCategory);
router.route("/deletecategory/:id").delete(deleteCategory);
router.route("/getcategory/:id").get(getCategory);
router.route("/getallcategory").get(getAllCategory);
export default router;