import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
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
        replies: [{
            comment: {
                type: String,
            },
            author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                username: {
                    type: String
                }
            }
        }]
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;