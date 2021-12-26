import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        item: {
            type: String,
            default: 'none',
            required: true,
        },
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
                type: String,
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
        price: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 0
        },
        tags: [{
            type: String
        }]
    },
    {
        timestamps: true,
    }
);

const Store = mongoose.model('Store', storeSchema);
export default Store;
