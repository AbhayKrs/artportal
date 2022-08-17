import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        files: [{ type: String, default: '' }],
        description: {
            type: String,
            required: true,
        },
        seller: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            username: {
                type: String,
            },
            avatar: {
                icon: { type: String, default: '' },
                category: { type: String, default: '' }
            },
            isSeller: {
                type: Boolean
            },
            seller_rating: {
                type: Number,
                default: 0,
                minimum: 0,
                maximum: 5
            }
        },
        price: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        reviews: [{
            content: { type: String },
            author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                username: { type: String, default: '' },
                avatar: {
                    icon: { type: String, default: '' },
                    category: { type: String, default: '' }
                },
            },
            rating: { type: Number, default: 0 },
            createdAt: { type: Date },
            updatedAt: { type: Date }
        }],
    },
    {
        timestamps: true,
    }
);

const Store = mongoose.model('Store', storeSchema);
export default Store;
