import {createCategory,getCategories,delCategories,updateCategories} from "../controllers/categories.controller.js";
import {upload} from "../middlewares/multer.js";
import express from "express";


const router = express.Router();

router.post("/", upload.single("image"), createCategory);
router.get("/get", getCategories);
router.delete("/:id", delCategories);
router.put("/:id", upload.single("image"), updateCategories);

export default router;