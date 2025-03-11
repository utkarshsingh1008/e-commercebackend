import Product from "../models/product.models.js";
 import User from "../models/user.models.js"
import expressAsyncHandler from "express-async-handler";
import slugify from "slugify"
import { ApiError } from "../utils/ApiError.js";
import e from "express";
const createProduct = expressAsyncHandler(async (req, res) => {
 try{
   if(req.body.tittle){
    req.body.slug = slugify(req.body.tittle)
   }
    const product = await Product.create(req.body);
   
    res.status(200).json({
    product,
    })
 }
 catch(error){
    throw new ApiError(500, error.message || "Failed to create product");
 }
 
});

const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    console.log(req.query);

    // Extract and process query parameters
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle field projection (select specific fields)
    let fields = req.query.fields;
    if (fields) {
      fields = fields.split(",").join(" "); // Convert comma-separated fields to space-separated
    }

    // Handle sorting
    let sortBy = req.query.sort;
    if (sortBy) {
      sortBy = sortBy.split(",").join(" "); // Convert comma-separated sorting fields to space-separated
    }

    // Handle pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Fetch products
    const products = await Product.find(queryObj)
      .select(fields)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // Response
    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to get products",
    });
  }
});


const getAProduct = expressAsyncHandler(async (req, res) => {
   try{
     const product = await Product.findById(req.params.id);
     if(!product){
       throw new ApiError(404, "Product not found");
     }
     res.status(200).json({
       product
     })
   }
    catch(error){
       throw new ApiError(500, error.message || "Failed to get product");
   }
})

const deleteAProduct = expressAsyncHandler(async (req, res) => {
   try{
     const deleteProduct = await Product.findByIdAndDelete(req.params.id);
     if(!deleteProduct){
       throw new ApiError(404, "Product not found");
     }
     res.status(200).json({
       message: "Product deleted",
       deleteAProduct
     })
   }
    catch(error){
       throw new ApiError(500, error.message || "Failed to get product");
   }
})

const updateProduct = expressAsyncHandler(async (req, res) => {
   try{
     const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
      message: "Product updated",
      updateProduct
    })
   }catch(error){
      throw new ApiError(500, error.message || "Failed to update product");
   }
})

const wishList = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
      const user = await User.findById(_id);

      // Check if the product is already in the wishlist
      const alreadyAdded = user.wishlist.includes(prodId);

      if (alreadyAdded) {
          // Remove product from wishlist
          const updatedUser = await User.findByIdAndUpdate(
              _id,
              { $pull: { wishlist: prodId } },
              { new: true }
          );
          res.status(200).json({ user: updatedUser });
      } else {
          // Add product to wishlist (fixed typo)
          const updatedUser = await User.findByIdAndUpdate(
              _id,
              { $push: { wishlist: prodId } }, // Changed wishList → wishlist
              { new: true }
          );
          res.status(200).json({ user: updatedUser });
      }
  } catch (error) {
      throw new ApiError(500, error.message || "Failed to update wishlist");
  }
});
  
const rating = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star,comment, prodId } = req.body;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has already rated
    let alreadyRated = product.rating.find(
      (rating) => rating?.postedBy?.toString() === _id.toString()
    );

    if (alreadyRated) {
      // Update existing rating
      await Product.findOneAndUpdate(
        { _id: prodId, "rating.postedBy": _id },
        { $set: { "rating.$.star": star , "rating.$.comment": comment } },
        { new: true }
      );
    } else {
      // Add new rating
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            rating: {
              star: star,
              comment:comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }

    // Recalculate and update total rating
    const updatedProduct = await Product.findById(prodId);
    const totalRatings = updatedProduct.rating.length;
    const ratingSum = updatedProduct.rating.reduce((sum, item) => sum + item.star, 0);
    const actualRating = (ratingSum / totalRatings).toFixed(2); // Keep 2 decimal places

    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      { totalrating: actualRating },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      product: finalProduct,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});



export { createProduct, getAllProducts, getAProduct, deleteAProduct, updateProduct, wishList, rating };