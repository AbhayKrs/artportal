import express from 'express';
const router = express.Router();

//Import Schemas
import Explore from '../models/explore.js';
import User from '../models/user.js';
import Common from '../models/common.js';

router.get('/', async (req, res) => {
    try {
        let searchList = [];
        const type = req.query.type;
        const value = req.query.value;

        const exploreData = await Explore.find({});
        const userData = await User.find({});
        const commonData = await Common.find({});

        switch (type) {
            case 'artwork': {
                searchList = exploreData.filter(item => item.title.toLowerCase().indexOf(value.toLowerCase()) != -1)
                break;
            }
            case 'tag': {
                searchList = commonData[0].tags.filter(item => item.includes(value))
                break;
            }
            case 'artist': {
                console.log('userData', userData)
                searchList = userData.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) != -1 || item.username.toLowerCase().indexOf(value.toLowerCase()) != -1).map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        username: item.username,
                        avatar: item.avatar
                    }
                })
                break;
            }
        }
        res.json(searchList);
    } catch (err) {
        res.status(500).send('Unable to find search result');
    }
})

export default router;
