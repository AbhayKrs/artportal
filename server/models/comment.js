import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who posted the comment
        text: { type: String, required: true }, // Text content of the comment
        is_parent: { type: Boolean, required: true }, // Identifier for if this is a parent/child comment
        parent_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Reference to the parent comment
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the artwork
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the artwork
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
