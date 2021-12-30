import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String
        },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            username: {
                type: String
            }
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;