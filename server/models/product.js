import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who posted the comment
        rating: { type: Number, min: 1, max: 5, required: true }, // Rating from 1 to 5
        comment: { type: String }, // Optional comment from the user
    },
    {
        timestamps: true
    }
);

const productSchema = new mongoose.Schema(
    {
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        images: [{ type: String }], // URLs to product images
        category: { type: String, index: true },
        tags: [{ type: String, index: true }],
        price: { type: Number, required: true },
        discount_price: { type: Number }, // optional discounted price
        stock: { type: Number, default: 1 }, // unique artworks may have only 1
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
        average_rating: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Review', reviewSchema);
export default {
    Product,
    Review
};
