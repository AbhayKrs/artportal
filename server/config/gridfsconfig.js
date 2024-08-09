import mongoose from 'mongoose';
import multer from 'multer';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

//Connect gfs to database
const conn = mongoose.connection;
let artworkgfs, storegfs, commongfs, taggergfs;

conn.once('open', () => {
    artworkgfs = Grid(conn.db, mongoose.mongo);
    storegfs = Grid(conn.db, mongoose.mongo);
    commongfs = Grid(conn.db, mongoose.mongo);
    taggergfs = Grid(conn.db, mongoose.mongo);

    artworkgfs.collection('artworks');
    storegfs.collection('stores');
    commongfs.collection('commons');
    taggergfs.collection('tagger');
});

//GridFs Storage DB - Artwork image files
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

//GridFs Storage DB - Store image files
const store_storage = new GridFsStorage({
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
                    bucketName: 'stores'
                };
                resolve(fileInfo);
            });
        });
    },
});

//GridFs Storage DB - Common image files
const common_storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename =
                    buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'commons',
                };
                resolve(fileInfo);
            });
        });
    },
});

//GridFs Storage DB - Artwork Categorisation model files
const tagger_storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                // const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: 'tagger'
                };
                resolve(fileInfo);
            });
        });
    },
});

const artworkUpl = multer({ artwork_storage });
const storeUpl = multer({ store_storage });
const commonUpl = multer({ common_storage });
const taggerUpl = multer({ tagger_storage });

export {
    artworkgfs,
    storegfs,
    commongfs,
    taggergfs,
    artworkUpl,
    storeUpl,
    commonUpl,
    taggerUpl
}