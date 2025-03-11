import Blogcategory from "../models/blogcategory.models.js";
import expressAsyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validateMongodbId.js";
import { ApiError } from "../utils/ApiError.js";

const createBlogCategory = expressAsyncHandler(async (req, res) => {
   try{
       const category = await Blogcategory.create(req.body);
       res.status(200).json({
           category
       })
   }
   catch(error){
    throw new ApiError(500, error.message || "Failed to create category");
   }
})

const updateBlogCategory = expressAsyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const updatedCategory = await Blogcategory.findByIdAndUpdate(id, req.body, {
            new: true
        }) 
        res.status(200).json({
             updatedCategory
        })
    }
   catch(error){
      throw new ApiError (500, error.message || "Failed to update category")
   }
})

const deleteBlogCategory = expressAsyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const deletedCategory = await Blogcategory.findByIdAndDelete(id) 
        res.status(200).json({
             message: "Category deleted sucessfully"
        })
    }
   catch(error){
      throw new ApiError (500, error.message || "Failed to delete category")
   }
})

const getBlogCategory = expressAsyncHandler(async (req, res) => {

    try{
        const {id} = req.params;
        const category = await Blogcategory.findById(id);
        res.status(200).json({
            category
        })
    }
    catch(error){
     throw new ApiError(500, error.message || "Failed to get category");
    }
 })

 const getAllBlogCategory = expressAsyncHandler(async (req, res) => {

    try{
       
        const allcategory = await Blogcategory.find();
        res.status(200).json({
            allcategory
        })
    }
    catch(error){
     throw new ApiError(500, error.message || "Failed to get all category");
    }
 })

export { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategory }