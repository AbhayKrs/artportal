import express from 'express';
import { commongfs, commonUpl } from '../config/gridfsconfig.js';

const router = express.Router();

import Common from '../models/common.js';
import { commonBucket } from '../config/gridfs_config.js';
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

// @route   GET api/v1.01/common/files --- Fetch all files --- PUBLIC
router.get("/files", async (req, res) => {
    try {
        commongfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files found'
                });
            }
            res.status(200).json({
                success: true,
                files
            })
        })
    } catch (err) {
        return res.status(404).json(err);
    }
});

// @route   GET api/v1.01/common/files/:filename --- Fetch file from common uploads db --- PUBLIC
router.get('/files/:filename', async (req, res) => {
    const { filename } = req.params;

    try {
        const file = await commonBucket.find({ filename }).toArray();
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file found' });
        }
        commonBucket.openDownloadStreamByName(filename).pipe(res);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Unable to fetch image');
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