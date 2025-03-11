
import { Router } from "express";
import { isadmin, authMiddleware } from "../middleware/auth.middleware.js";
import { createBrand, deleteBrand, getAllBrand, getBrand, updateBrand } from "../controllers/brand.controllers.js";

const router = Router();

router.route("/createbrand").post(createBrand);
router.route("/updatebrand/:id").put(updateBrand);
router.route("/deletebrand/:id").delete(deleteBrand);
router.route("/getbrand/:id").get(getBrand);
router.route("/getallbrand").get(getAllBrand);
export default router;