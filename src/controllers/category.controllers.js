import Category from "../models/category.models.js";
import expressAsyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validateMongodbId.js";
import { ApiError } from "../utils/ApiError.js";

const createCategory = expressAsyncHandler(async (req, res) => {
   try{
       const category = await Category.create(req.body);
       res.status(200).json({
           category
       })
   }
   catch(error){
    throw new ApiError(500, error.message || "Failed to create category");
   }
})

const updateCategory = expressAsyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
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

const deleteCategory = expressAsyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const deletedCategory = await Category.findByIdAndDelete(id) 
        res.status(200).json({
             message: "Category deleted sucessfully"
        })
    }
   catch(error){
      throw new ApiError (500, error.message || "Failed to delete category")
   }
})

const getCategory = expressAsyncHandler(async (req, res) => {

    try{
        const {id} = req.params;
        const category = await Category.findById(id);
        res.status(200).json({
            category
        })
    }
    catch(error){
     throw new ApiError(500, error.message || "Failed to get category");
    }
 })

 const getAllCategory = expressAsyncHandler(async (req, res) => {

    try{
       
        const allcategory = await Category.find();
        res.status(200).json({
            allcategory
        })
    }
    catch(error){
     throw new ApiError(500, error.message || "Failed to get all category");
    }
 })

export { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory }