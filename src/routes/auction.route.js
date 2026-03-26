import { Router } from "express";
import {
    createAuction,
    getAllAuctions,
    getsellerAuctions,
    getAuctionById,
    updateAuction,
    getActiveAuctions,
    startAuction,
    endAuction,
} from "../controllers/auction.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateData } from "../middlewares/validate.middleware.js";
import {
    auctionCreateValidator,
    updateAuctionValidator,
} from "../validation/auction.validator.js";
const router = Router();

router
    .route("/")
    .get(getAllAuctions)
    .post(validateData(auctionCreateValidator), protect, createAuction);
router.route("/seller").get(protect, getsellerAuctions);
router.route("/live").get(getActiveAuctions);
router
    .route("/:id")
    .get(getAuctionById)
    .patch(validateData(updateAuctionValidator), protect, updateAuction);
router.route("/:id/start").post(protect, startAuction);
router.route("/:id/end").post(protect, endAuction);

export default router;
