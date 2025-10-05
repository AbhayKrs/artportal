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

const common_storage = new GridFsStorage({
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
                    bucketName: 'common'
                };
                resolve(fileInfo);
            });
        });
    },
});

const artwork_storage = new GridFsStorage({
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

const product_storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            console.log("Received file for upload:", file.originalname);
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'products'
                };
                resolve(fileInfo);
            });
        });
    },
});

const tagger_storage = new GridFsStorage({
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
                    bucketName: 'tagger'
                };
                resolve(fileInfo);
            });
        });
    },
});

const artworkUpl = multer({ storage: artwork_storage });
const productUpl = multer({ storage: product_storage });
const commonUpl = multer({ storage: common_storage });
const taggerUpl = multer({ storage: tagger_storage });

export { artworkBucket, productBucket, commonBucket, taggerBucket, artworkUpl, productUpl, commonUpl, taggerUpl }