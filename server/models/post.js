import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        is_repost: { type: Boolean, default: false },
        reposter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        // space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', default: null },
        visibility: { type: String, enum: ["public", "archived"], default: "public" },
        full_text: { type: String, required: true },
        files: [{ type: String, required: true }],
        poll: {
            question: { type: String, required: true },
            multiple_choice: { type: Boolean, default: false },
            options: [{
                text: { type: String, required: true },
                votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
            }],
            total_votes: { type: Number, default: 0 },
            expires_at: { type: Date }
        },
        views: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
