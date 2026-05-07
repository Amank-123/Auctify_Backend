import { Category } from "../models/categories.model.js";
import uploadMedia from "../utils/uploadMedia.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createCategory = asyncHandler(async (req, res) => {
  
      const { name, cta } = req.body;
      const uploadedImage = await uploadMedia(req, res);

      const category = await Category.create({
         name,
         cta,
         image: uploadedImage.url,
      });

        return ApiResponse(res,201,"success",category);
   
});

export const getCategories = asyncHandler(async (req, res) => {

 const categories = await Category.find();

 return ApiResponse(res,200,"success",categories);
});

export const delCategories = asyncHandler(async (req, res) => {

 const categories = await Category.findByIdAndDelete(req.params.id);

 return ApiResponse(res,200,"deleted",categories);
});
export const updateCategories = asyncHandler(async (req, res) => {

 const categories = await Category.findByIdAndUpdate(req.params.id,req.body,{new:true});

 return ApiResponse(res,200,"updated",categories);
});