import express from 'express';
const router = express.Router();

import NodeCache from "node-cache";
const agentCache = new NodeCache({ stdTTL: 3600 });

import { taggerBucket } from '../config/gridfs_config.js';

// @route   GET api/v1.01/agents/tagger --- Filter based on search query --- Public
router.get(`/tagger/:filename`, async (req, res) => {
    const { filename } = req.params;

    const cachedImage = agentCache.get(filename);
    if (cachedImage) {
        res.set({
            "Content-Type": cachedImage.contentType,
            "Cache-Control": "public, max-age=31536000", // browser cache
        });
        return res.send(cachedImage.buffer);
    }

    try {
        const downloadStream = taggerBucket.openDownloadStreamByName(filename);
        let chunks = [];

        downloadStream.on("data", (chunk) => chunks.push(chunk));

        downloadStream.on("end", () => {
            const fileBuffer = Buffer.concat(chunks);

            // Guess content type by extension (basic way)
            let contentType = "";
            if (filename.endsWith(".json")) contentType = "application/json";
            if (filename.endsWith(".bin")) contentType = "application/octet-stream";

            // 3. Save to cache
            agentCache.set(filename, { buffer: fileBuffer, contentType });

            // 4. Send to client
            res.set({
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000",
            });
            res.send(fileBuffer);
        });

        downloadStream.on("error", (err) => {
            console.error("GridFS error:", err);
            return res.status(404).json({ err: "File not found" });
        });
    } catch (err) {
        console.log("Server err", err);
        return res.status(500).json({ msg: err.name });
    }
});

export default router;