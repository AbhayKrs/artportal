import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';

//Connect gfs to database
const conn = mongoose.connection;
let artworkBucket, storeBucket, commonBucket, taggerBucket;

conn.once('open', () => {
    artworkBucket = new GridFSBucket(conn.db, { bucketName: 'artworks' });
    storeBucket = new GridFSBucket(conn.db, { bucketName: 'stores' });
    commonBucket = new GridFSBucket(conn.db, { bucketName: 'commons' });
    taggerBucket = new GridFSBucket(conn.db, { bucketName: 'tagger' });
});

const storage = multer.memoryStorage();

const artworkUpl = multer({ storage });
const storeUpl = multer({ storage });
const commonUpl = multer({ storage });
const taggerUpl = multer({ storage });

export { artworkBucket, storeBucket, commonBucket, taggerBucket, artworkUpl, storeUpl, commonUpl, taggerUpl }