import mongoose from 'mongoose';

const Catalog_likesSchema = new mongoose.Schema(
    {
        catalog_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Catalog'
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        is_liked: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const Comment_likesSchema = new mongoose.Schema(
    {
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Catalog'
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        is_liked: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const Catalog_Likes = mongoose.model('Catalog_Likes', Catalog_likesSchema);
const Comment_Likes = mongoose.model('Comment_Likes', Comment_likesSchema);

export default {
    Catalog_Likes: Catalog_Likes,
    Comment_Likes: Comment_Likes
};
