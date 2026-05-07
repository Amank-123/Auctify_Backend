

import express from "express";

import {
    createBanner,
    getBanners,
    deleteBanner,
    updateBanner,
} from "../controllers/banner.controller.js";

import { upload } from "../middlewares/multer.js";

const router = express.Router();
router.post(
    "/",
    upload.single("image"),
    createBanner
);
router.get("/get", getBanners);
router.delete("/:id", deleteBanner);
router.put(
    "/:id",
    upload.single("image"),
    updateBanner
);


export default router;