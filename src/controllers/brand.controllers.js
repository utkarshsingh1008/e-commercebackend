import Brand from "../models/brand.models.js";
import expressAsyncHandler from "express-async-handler";
import validateMongodbId from "../utils/validateMongodbId.js";
import { ApiError } from "../utils/ApiError.js";

const createBrand = expressAsyncHandler(async (req, res) => {
   try{
       const brand = await Brand.create(req.body);
       res.status(200).json({
           brand
       })
   }
   catch(error){
    throw new ApiError(500, error.message || "Failed to create Brand");
   }
})

const updateBrand = expressAsyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        }) 
        res.status(200).json({
             updatedBrand
        })
    }
   catch(error){
      throw new ApiError (500, error.message || "Failed to update Brand")
   }
})

const deleteBrand = expressAsyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const deletedBrand = await Brand.findByIdAndDelete(id) 
        res.status(200).json({
             message: "Brand deleted sucessfully"
        })
    }
   catch(error){
      throw new ApiError (500, error.message || "Failed to delete Brand")
   }
})

const getBrand = expressAsyncHandler(async (req, res) => {

    try{
        const {id} = req.params;
        const Brand = await Brand.findById(id);
        res.status(200).json({
            Brand
        })
    }
    catch(error){
     throw new ApiError(500, error.message || "Failed to get Brand");
    }
 })

 const getAllBrand = expressAsyncHandler(async (req, res) => {

    try{
       
        const allBrand = await Brand.find();
        res.status(200).json({
            allBrand
        })
    }
    catch(error){
     throw new ApiError(500, error.message || "Failed to get all Brand");
    }
 })

export { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand }