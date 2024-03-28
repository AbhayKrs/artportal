import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        parent_comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;