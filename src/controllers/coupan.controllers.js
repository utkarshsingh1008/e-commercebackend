import expressAsyncHandler from "express-async-handler";
import Coupan from "../models/coupan.models.js";
import validateMongodbId from "../utils/validateMongodbId.js";
import { ApiError } from "../utils/ApiError.js";

const createCoupan = expressAsyncHandler(async (req, res) => {
  try {
    const newCoupan = await Coupan.create(req.body);
    res.json(newCoupan);
  } catch (error) {
    throw new ApiError(error);
  }
});

const getAllCoupan = expressAsyncHandler(async (req, res) => {
    try {
      const allCoupan = await Coupan.find();
      res.json(allCoupan);
    } catch (error) {
      throw new ApiError(error);
    }
  });

  const updateCoupan = expressAsyncHandler(async (req, res) => {
      
    const {id} = req.params;
    validateMongodbId(id)
    try {
      const updateCoupan = await Coupan.findByIdAndUpdate(id,req.body,{new : true});
      res.json(updateCoupan);
    } catch (error) {
      throw new ApiError(error);
    }
  });

  const deleteCoupan = expressAsyncHandler(async (req, res) => {
      
    const {id} = req.params;
    validateMongodbId(id)
    try {
      const deleteCoupan = await Coupan.findByIdAndDelete(id);
      res.json({
        message: "coupan deleted sucessfully",
        deleteCoupan});
    } catch (error) {
      throw new ApiError(error);
    }
  });

export {createCoupan, getAllCoupan,  updateCoupan, deleteCoupan};