
import { Router } from "express";
import { isadmin, authMiddleware } from "../middleware/auth.middleware.js";
import { createBlogCategory, updateBlogCategory,deleteBlogCategory, getBlogCategory ,getAllBlogCategory} from "../controllers/blogcategory.controllers.js";

const router = Router();

router.route("/createblogcategory").post(createBlogCategory);
router.route("/updateblogcategory/:id").put(updateBlogCategory);
router.route("/deleteblogcategory/:id").delete(deleteBlogCategory);
router.route("/getblogcategory/:id").get(getBlogCategory);
router.route("/getallblogcategory").get(getAllBlogCategory);
export default router;