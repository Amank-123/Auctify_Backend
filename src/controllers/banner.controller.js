import {
    createBannerDB,
    getBannersDB,
    deleteBannerDB,
    updateBannerDB,
} from "../services/banner.service.js";

import uploadMedia from "../utils/uploadMedia.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const createBanner = asyncHandler(
    async (req, res) => {
        if (!req.file) {
            throw new ApiError(
                400,
                "Banner image is required"
            );
        }

        const uploadedImage =
            await uploadMedia(req, res);

        const banner =
            await createBannerDB(
                req.body,
                uploadedImage.url
            );

        if (!banner) {
            throw new ApiError(
                500,
                "Failed to create banner"
            );
        }

        return ApiResponse(
            res,
            201,
            "Banner created successfully",
            banner
        );
    }
);


const getBanners = asyncHandler(
    async (req, res) => {
        const banners =
            await getBannersDB();

        return ApiResponse(
            res,
            200,
            "Banners fetched successfully",
            banners
        );
    }
);


const deleteBanner = asyncHandler(
    async (req, res) => {
        const banner =
            await deleteBannerDB(
                req.params.id
            );

        if (!banner) {
            throw new ApiError(
                404,
                "Banner not found"
            );
        }

        return ApiResponse(
            res,
            200,
            "Banner deleted successfully",
            banner
        );
    }
);

const updateBanner = asyncHandler(
    async (req, res) => {
        let image = null;

        if (req.file) {
            const uploadedImage =
                await uploadMedia(
                    req,
                    res
                );

            image = uploadedImage.url;
        }

        const banner =
            await updateBannerDB(
                req.params.id,
                req.body,
                image
            );

        if (!banner) {
            throw new ApiError(
                404,
                "Banner not found"
            );
        }

        return ApiResponse(
            res,
            200,
            "Banner updated successfully",
            banner
        );
    }
);

export {
    createBanner,
    getBanners,
    deleteBanner,
    updateBanner,
};