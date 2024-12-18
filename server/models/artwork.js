import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who posted the comment
        text: { type: String, required: true }, // Text content of the comment
        parent_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Reference to the parent comment
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the artwork
    },
    {
        timestamps: true
    }
);

const artworkSchema = new mongoose.Schema(
    {
        artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        files: [{ type: String, required: true }],
        categories: [{ type: String, default: '' }],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
        views: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the artwork
        comments: [commentSchema],
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);
const Artwork = mongoose.model('Artwork', artworkSchema);
export default {
    Artwork,
    Comment
};
