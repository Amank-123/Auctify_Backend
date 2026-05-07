import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
   title: String,

   description: String,

   cta: String,

   image: String,

   category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
   },
});

export const Banner = mongoose.model("Banner", bannerSchema);