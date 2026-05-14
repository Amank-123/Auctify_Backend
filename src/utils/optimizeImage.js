import sharp from "sharp";

export const optimizeImage = async (buffer) => {
    return await sharp(buffer)
        .resize({
            width: 1400,
            withoutEnlargement: true,
        })
        .jpeg({
            quality: 75,
        })
        .toBuffer();
};
