import express from 'express';
const router = express.Router();

//Import Schemas
import User from '../models/user.js';
import Artworks from '../models/artwork.js';
import Common from '../models/common.js';
const { Artwork } = Artworks;
const { Tag } = Common;

// @route   GET api/v1.01/search --- Filter based on search query --- Public
router.get('/', async (req, res) => {
    try {
        let searchResponse = [];
        const type = req.query.type;
        const value = req.query.value;
        const filter = req.query.filter;
        const period = req.query.period;
        console.log("test", type, value, !!filter, !!period);

        switch (type) {
            case 'artwork': {
                const artworkList = await Artwork.find({}).populate('artist', 'name username avatar');
                searchResponse = artworkList.filter(item => item.title.toLowerCase().indexOf(value.toLowerCase()) != -1);
                break;
            }
            case 'tag': {
                const tagList = await Tag.find({});
                searchResponse = tagList.find(item => item.value.toLowerCase().includes(value.toLowerCase()));
                break;
            }
            case 'artist': {
                const userList = await User.find({});
                searchResponse = userList.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) != -1 || item.username.toLowerCase().indexOf(value.toLowerCase()) != -1);
                break;
            }
        }
        res.json(searchResponse);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('No data found. Please try again');
    }
});

export default router;