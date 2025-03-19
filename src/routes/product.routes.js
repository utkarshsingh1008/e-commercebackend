import express from "express";
import { authMiddleware, isadmin } from "../middleware/auth.middleware.js";
import { productResizeImg, uploadPhoto } from "../middleware/uploadImg.js";
import {
  createProduct,
  getAllProducts,
  getAProduct,
  deleteAProduct,
  updateProduct,
  wishList,
  rating,
  uploadImages
} from "../controllers/product.controllers.js";
const router = express.Router();
router.post("/product",authMiddleware,isadmin,  createProduct);
router.get("/allproduct", getAllProducts);
router.get("/getaproduct/:id", getAProduct);
router.delete("/deleteaproduct/:id",authMiddleware,isadmin, deleteAProduct);
router.put("/updateproduct/:id",authMiddleware,isadmin, updateProduct);
router.put("/uploadimg/:id",authMiddleware,isadmin, uploadPhoto.array('images',10),
productResizeImg, uploadImages );
router.put("/wishlist",authMiddleware, wishList);
router.put("/rating",authMiddleware, rating);

export default router;
