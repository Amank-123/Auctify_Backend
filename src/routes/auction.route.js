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
import { upload } from "../middlewares/multer.js";
import { protectedApiLimiter } from "../limiters/protectedApi.limiter.js";
import { publicApiLimiter } from "../limiters/publicApi.limiter.js";
const router = Router();

router
    .route("/")
    .get(publicApiLimiter, getAllAuctions)
    .post(
        upload.array("media", 10),
        validateData(auctionCreateValidator),
        protect,
        protectedApiLimiter,
        createAuction
    );
router.route("/seller").get(protect, protectedApiLimiter, getsellerAuctions);
router.route("/live").get(publicApiLimiter, getActiveAuctions);
router
    .route("/:id")
    .get(publicApiLimiter, getAuctionById)
    .patch(
        validateData(updateAuctionValidator),
        protect,
        protectedApiLimiter,
        updateAuction
    );
router.route("/:id/start").post(protect, protectedApiLimiter, startAuction);
router.route("/:id/end").post(protect, protectedApiLimiter, endAuction);

export default router;
