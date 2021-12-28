import mongoose from 'mongoose';

const exploreSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            default: 'none',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            username: {
                type: String,
            },
        },
        description: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        // comments: ['Comment'],
        comments: [{
            content: {
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
            likes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: ''
            }],
            createdAt: { type: Date },
            updatedAt: { type: Date }
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        like_status: {
            type: Boolean
        },
        comment_count: {
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

const Explore = mongoose.model('Explore', exploreSchema);
export default Explore;
