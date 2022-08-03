import mongoose from 'mongoose';
import Explore from './explore.js';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    google_id: { type: String },
    google_authenticated: { type: Boolean, default: false },
    name: {
        type: String,
        default: "",
        required: true
    },
    email: {
        type: String,
        default: '',
        required: true
    },
    username: {
        type: String,
        default: '',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    avatar: {
        icon: { type: String, default: '' },
        category: { type: String, default: '' }
    },
    tokens: { type: Number, default: 0 },
    explore: [{
        files: [{ type: String, default: '' }],
        title: { type: String, required: true },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: { type: String, default: '' },
            avatar: {
                icon: { type: String, default: '' },
                category: { type: String, default: '' }
            }
        },
        description: { type: String, required: true },
        comments: [{
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
            likes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: ''
            }],
            createdAt: { type: Date },
            updatedAt: { type: Date }
        }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        like_status: { type: Boolean },
        comment_count: { type: Number, default: 0 },
        tags: [{ type: String, default: '' }]
    }],
    explore_count: { type: Number, default: 0 },
    followers: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: { type: String, required: true },
        username: { type: String, default: '' },
        avatar: {
            icon: { type: String, default: '' },
            category: { type: String, default: '' }
        }
    }],
    followers_count: { type: Number, default: 0 },
    cart: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
        file: { type: String, default: '' },
        title: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 },
        seller: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, default: '' },
            avatar: {
                icon: { type: String, default: '' },
                category: { type: String, default: '' }
            }
        }
    }],
    cart_count: { type: Number, default: 0 },
    bookmarked: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Explore' },
        files: [{ type: String, default: '' }],
        title: { type: String, required: true },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: { type: String, default: '' },
            avatar: {
                icon: { type: String, default: '' },
                category: { type: String, default: '' }
            }
        },
        description: { type: String, required: true }
    }],
    seller: { type: Boolean, default: false },
    seller_rating: { type: Number },
    store: { type: Array },
    store_count: { type: Number },
    ysr: { type: Number }
}, { strict: false });

const User = mongoose.model("User", UserSchema);
export default User;