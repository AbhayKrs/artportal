import express from 'express';
const router = express.Router();
import { productBucket, productUpl } from '../config/gridfs_config.js';

import NodeCache from "node-cache";
const imageCache = new NodeCache({ stdTTL: 3600 });

//Middleware
import { protect } from '../middleware/authMw.js';
import { checkObjectId } from '../middleware/checkObjectId.js';

//Import Schemas
import Products from '../models/product.js';
import User from '../models/user.js';
import Cart from '../models/cart.js';
const { Product, Review } = Products;

// @route   GET api/v1.01/products/image/:filename --- Image from gridFS storage --- Public
router.get('/image/:filename', async (req, res) => {
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
        const downloadStream = productBucket.openDownloadStreamByName(filename);
        let chunks = [];

        downloadStream.on("data", (chunk) => chunks.push(chunk));

        downloadStream.on("end", () => {
            const fileBuffer = Buffer.concat(chunks);

            // Guess content type by extension (basic way)
            let contentType = "image/jpeg";
            if (filename.endsWith(".webp")) contentType = "image/webp";
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

// @route   GET api/v1.01/products --- Fetch all products --- PUBLIC
router.get('/', async (req, res) => {
    try {
        let products = [];
        const category = req.query.category;
        if (!category) {
            products = await Product.find({})
                .populate('seller', 'name username avatar')
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'reviewer',
                        select: 'name username avatar'
                    }
                });;
        } else {
            const data = await Product.find({});
            products = data.filter(item => item.category === category);
        }
        res.send(products);
    } catch (err) {
        res.status(500).send('Unable to fetch products');
    }
});

// @route   POST api/v1.01/products/new --- Create new product listing --- PUBLIC
router.post('/new',
    protect,
    productUpl.any((err, req, res, next) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(500).send('Upload failed');
        }
        next();
    }),
    async (req, res) => {
        try {
            const user = await User.findById(req.body.userID);

            console.log("body", req.files);

            const newProduct = new Product({
                seller: user._id,
                title: req.body.title,
                description: req.body.description,
                images: req.files.map(file => { return file.filename }),
                category: req.body.category,
                tags: req.body.tags,
                price: req.body.price,
                discount_price: req.body.discount_price, // optional discounted price
                stock: req.body.stock, // unique artworks may have only 1
                reviews: [],
                average_rating: 0
            });

            console.log("newProduct", newProduct)

            newProduct.save()
                .then(data => {
                    console.log("data", data)
                    res.send(data)
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.log("err: ", err)
            return res.status(404).json({ msg: err.name });
        }
    }
);

// @route   GET api/v1.01/products/:id --- Fetch product by id --- PUBLIC
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name username avatar')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'reviewer',
                    select: 'name username avatar'
                }
            });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch product item');
    }
});

// @route   PUT api/v1.01/products/:id --- Edit product by id --- PUBLIC
router.put('/:id', protect, function (req, res) {
    try {
        const updatedProduct = {
            title: req.body.title,
            description: req.body.description,
            images: req.files.map(file => { return file.filename }),
            category: req.body.category,
            tags: req.body.tags.map(tag => { return JSON.parse(tag)._id }),
            price: req.body.price,
            discount_price: req.body.discount_price, // optional discounted price
            stock: req.body.stock
        };
        Product.findByIdAndUpdate(req.params.id, { $set: updatedProduct }, (err, data) => {
            if (err) {
                console.log("err", err);
            } else {
                res.send(data);
            }
        });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   DELETE api/v1.01/products/:id --- Delete product by id --- PUBLIC
router.delete('/:id', protect, async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("No such product found!");
        }

        product.files.map(async file => {
            const toDelete = await productBucket.find({ filename: file });
            const fileToDelete = await toDelete.next();
            console.log("fileToDelete", fileToDelete);
            if (!fileToDelete) return;
            productBucket.delete(fileToDelete._id);
        });

        const cart = await Cart.find({});
        cart = [...cart.filter(item => item.item_id != req.params.id)];
        cart.save();

        product.deleteOne({ _id: product._id });
        res.send('Product removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Artwork removal failed');
    }
});

export default router;
