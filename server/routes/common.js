import express from 'express';
const router = express.Router();
import { commonBucket, commonUpl } from '../config/gridfs_config.js';

import NodeCache from "node-cache";
const imageCache = new NodeCache({ stdTTL: 3600 });

import Common from '../models/common.js';
const { Tag, Sticker, Avatar, Location } = Common;

// @route   GET api/v1.01/common/tags --- Fetch tags --- PUBLIC
router.get("/tags", async (req, res) => {
    try {
        const tags = await Tag.find({});
        res.json(tags);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/common/tags/add --- Add a tag --- PUBLIC
router.post("/tags/add", async (req, res) => {
    try {
        const artTags = [
            "#Art", "#ArtWork", "#Artist", "#Artistic", "#ArtGallery", "#ArtLovers", "#ArtCommunity",
            "#ArtCollector", "#ArtDaily", "#ArtOfTheDay",
            "#Painting", "#DigitalArt", "#Illustration", "#Drawing", "#Sketch", "#Watercolor",
            "#Acrylic", "#OilPainting", "#PastelArt", "#InkArt", "#Sculpture", "#MixedMedia", "#Collage",
            "#AbstractArt", "#Surrealism", "#Impressionism", "#Realism", "#PopArt", "#Cubism", "#Minimalism",
            "#Expressionism", "#ContemporaryArt", "#ModernArt",
            "#NatureArt", "#PortraitArt", "#FigureDrawing", "#FantasyArt", "#SciFiArt", "#ConceptArt",
            "#StreetArt", "#UrbanArt", "#AnimalArt", "#FloralArt",
            "#ArtShow", "#ArtExhibition", "#ArtFair", "#ArtMarket", "#ArtFestival", "#ArtAuction",
            "#ArtistOnInstagram", "#SupportLocalArtists", "#ArtStudio",
            "#LineArt", "#DoodleArt", "#3DArt", "#VectorArt", "#Calligraphy", "#Typography",
            "#SprayPaint", "#GraffitiArt", "#HandLettering",
            "#ArtInspiration", "#ArtisticExpression", "#CreativeProcess", "#ArtTherapy", "#ArtJourney",
            "#ArtChallenge", "#DailyArt", "#ArtPractice", "#ArtGoals",
            "#ArtOnInstagram", "#ArtOnTwitter", "#ArtOnDeviantArt", "#ArtOnEtsy", "#ArtOnBehance",
            "#ArtOnPinterest", "#ArtOnTumblr", "#ArtOnTikTok"
        ];

        let proms = [];
        artTags.forEach(tag => {
            const prom = new Promise((resolve, reject) => {
                const newTag = new Tag({
                    value: tag
                });
                Tag.create(newTag);
                resolve();
            });
            proms.push(prom);
        })
        Promise.all(proms).then(() => {
            console.log("tags added");
            res.send("tags added");
        })
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/common/files --- Fetch all files from common uploads db --- PUBLIC
router.get('/files', async (req, res) => {
    try {
        const files = commonBucket.find({}).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ msg: "No files found" });
        }

        // Map only required info to send to client
        const fileList = files.map(file => ({
            filename: file.filename,
            length: file.length,
            contentType: file.contentType || 'unknown',
            uploadDate: file.uploadDate,
        }));

        return res.json(fileList);
    } catch (err) {
        console.error("Error fetching files:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

// @route   GET api/v1.01/common/files/:filename --- Fetch file from common uploads db --- PUBLIC
router.get('/files/:filename', async (req, res) => {
    const { filename } = req.params;

    const cachedImage = imageCache.get(filename);
    if (cachedImage) {
        res.set({
            "Content-Type": cachedImage.contentType,
            "Cache-Control": "public, max-age=31536000", // browser cache
        });
        return res.send(cachedImage.buffer);
    }

    try {
        const downloadStream = commonBucket.openDownloadStreamByName(filename);
        let chunks = [];

        downloadStream.on("data", (chunk) => chunks.push(chunk));

        downloadStream.on("end", () => {
            const fileBuffer = Buffer.concat(chunks);

            // Guess content type by extension (basic way)
            let contentType = "image/jpeg";
            if (filename.endsWith(".png")) contentType = "image/png";
            if (filename.endsWith(".gif")) contentType = "image/gif";

            // 3. Save to cache
            imageCache.set(filename, { buffer: fileBuffer, contentType });

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

// @route   POST api/v1.01/common/files/:filename --- Upload a new file to common uploads db --- PUBLIC
router.post('/files/upload', commonUpl.any(), async (req, res) => {
    try {
        const type = req.query.type;
        let proms = [];

        switch (type) {
            case 'avatar': {
                req.files.map(file => {
                    const prom = new Promise((resolve, reject) => {
                        const newAvatar = new Avatar({
                            icon: file.filename,
                            identity: 'Male'
                        });
                        Avatar.create(newAvatar);
                        resolve();
                    });
                    proms.push(prom);
                });
                break;
            }
            case 'sticker': {
                req.files.map(file => {
                    const prom = new Promise((resolve, reject) => {
                        const newSticker = new Sticker({
                            icon: file.filename,
                            cost: '699'
                        });
                        Sticker.create(newSticker);
                        resolve();
                    });
                    proms.push(prom);
                });
                break;
            }
            default: break;
        }
        Promise.all(proms).then(() => {
            console.log("upload done");
            res.send("upload done");
        })
    } catch (err) {
        console.log("error", err)
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/common/avatars --- Fetch all user avatars --- PUBLIC
router.get('/avatars', async (req, res) => {
    try {
        const avatars = await Avatar.find({});
        res.json(avatars);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/common/stickers --- Fetch all gift stickers --- PUBLIC
router.get('/stickers', async (req, res) => {
    try {
        const stickers = await Sticker.find({});
        res.json(stickers);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/common/locations --- Fetch all gift stickers --- PUBLIC
router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});


export default router;