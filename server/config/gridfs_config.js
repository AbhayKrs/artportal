import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { GridFsStorage } from "multer-gridfs-storage";
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

//Connect gfs to database
const conn = mongoose.connection;
let artworkBucket, productBucket, commonBucket, taggerBucket;

conn.once('open', async () => {
    artworkBucket = new GridFSBucket(conn.db, { bucketName: 'artworks' });
    productBucket = new GridFSBucket(conn.db, { bucketName: 'products' });
    commonBucket = new GridFSBucket(conn.db, { bucketName: 'commons' });
    taggerBucket = new GridFSBucket(conn.db, { bucketName: 'tagger' });

    try {
        await conn.db.collection("artworks.files").createIndex({ filename: 1 });
        await conn.db.collection("products.files").createIndex({ filename: 1 });
        await conn.db.collection("commons.files").createIndex({ filename: 1 });
        await conn.db.collection("tagger.files").createIndex({ filename: 1 });
    } catch (err) {
        console.error("❌ Index creation failed:", err);
    }
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
const productUpl = multer({ storage });
const commonUpl = multer({ storage });
const taggerUpl = multer({ storage });

export { artworkBucket, productBucket, commonBucket, taggerBucket, artworkUpl, productUpl, commonUpl, taggerUpl }