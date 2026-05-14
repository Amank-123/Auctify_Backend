import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

import fs from "fs";
import path from "path";
import os from "os";

ffmpeg.setFfmpegPath(ffmpegPath);

export const optimizeVideo = (buffer) => {
    return new Promise((resolve, reject) => {
        const inputPath = path.join(os.tmpdir(), `input-${Date.now()}.mp4`);

        const outputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp4`);

        fs.writeFileSync(inputPath, buffer);

        ffmpeg(inputPath)
            .outputOptions(["-preset fast", "-crf 28", "-vf scale=1280:-2"])
            .videoCodec("libx264")
            .format("mp4")
            .save(outputPath)
            .on("end", () => {
                const optimizedBuffer = fs.readFileSync(outputPath);

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);

                resolve(optimizedBuffer);
            })
            .on("error", (err) => {
                if (fs.existsSync(inputPath)) {
                    fs.unlinkSync(inputPath);
                }

                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }

                reject(err);
            });
    });
};
