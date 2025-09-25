import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { GridFsStorage } from "multer-gridfs-storage";
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

//Connect gfs to database
const conn = mongoose.connection;
let artworkBucket, storeBucket, commonBucket, taggerBucket;

conn.once('open', () => {
    artworkBucket = new GridFSBucket(conn.db, { bucketName: 'artworks' });
    storeBucket = new GridFSBucket(conn.db, { bucketName: 'stores' });
    commonBucket = new GridFSBucket(conn.db, { bucketName: 'commons' });
    taggerBucket = new GridFSBucket(conn.db, { bucketName: 'tagger' });
});

// const storage = multer.memoryStorage();

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'artworks'
                };
                resolve(fileInfo);
            });
        });
    },
});

const artworkUpl = multer({ storage });
const storeUpl = multer({ storage });
const commonUpl = multer({ storage });
const taggerUpl = multer({ storage });

export { artworkBucket, storeBucket, commonBucket, taggerBucket, artworkUpl, storeUpl, commonUpl, taggerUpl }