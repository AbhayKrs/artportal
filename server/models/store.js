import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who left the review
        rating: { type: Number, min: 1, max: 5, required: true }, // Rating from 1 to 5
        comment: { type: String }, // Optional comment from the user
    },
    {
        timestamps: true
    }
);

const storeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        size: { type: String, required: true },
        files: [{ type: String, required: true }],
        artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        price: { type: Number, default: 0 },
        categories: [{ type: String, default: '' }],
        reviews: [reviewSchema],
    },
    {
        timestamps: true,
    }
);

const Store = mongoose.model('Store', storeSchema);
export default Store;
