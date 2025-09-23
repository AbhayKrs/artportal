import express from 'express';
const router = express.Router();

import { taggerBucket } from '../config/gridfs_config.js';

// @route   GET api/v1.01/agents/tagger --- Filter based on search query --- Public
router.get(`/api/${process.env.API_VERSION}/tagger/:filename`, async (req, res) => {
    const { filename } = req.params;

    try {
        const file = await taggerBucket.find({ filename }).toArray();

        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file found' });
        }
        taggerBucket.openDownloadStreamByName(filename).pipe(res);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

export default router;