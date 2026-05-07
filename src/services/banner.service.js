// services/banner.service.js

import { Banner } from "../models/banner.model.js";

/* ─────────────────────────────────────────────
   CREATE BANNER
───────────────────────────────────────────── */
const createBannerDB = async (
    data,
    image
) => {
    const banner = await Banner.create({
        title: data.title,
        description: data.description,
        cta: data.cta,
        category: data.category,
        image,
    });

    return banner;
};

/* ─────────────────────────────────────────────
   GET ALL BANNERS
───────────────────────────────────────────── */
const getBannersDB = async () => {
    const banners = await Banner.find()
        .populate("category", "name")
        .sort({
            createdAt: -1,
        });

    return banners;
};

/* ─────────────────────────────────────────────
   DELETE BANNER
───────────────────────────────────────────── */
const deleteBannerDB = async (id) => {
    return await Banner.findByIdAndDelete(id);
};

/* ─────────────────────────────────────────────
   UPDATE BANNER
───────────────────────────────────────────── */
const updateBannerDB = async (
    id,
    data,
    image
) => {
    const banner = await Banner.findById(id);

    if (!banner) return null;

    if (data.title)
        banner.title = data.title;

    if (data.description)
        banner.description =
            data.description;

    if (data.cta)
        banner.cta = data.cta;

    if (data.category)
        banner.category =
            data.category;

    if (image)
        banner.image = image;

    await banner.save();

    return banner;
};

export {
    createBannerDB,
    getBannersDB,
    deleteBannerDB,
    updateBannerDB,
};