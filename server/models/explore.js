import mongoose from 'mongoose';

const exploreSchema = new mongoose.Schema(
    {
        files: [{ type: String, default: '' }],
        title: {
            type: String,
            required: true,
        },
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
        description: {
            type: String,
            required: true,
        },
        comments: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
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
        awards: [{
            id: { type: mongoose.Schema.Types.ObjectId },
            icon: { type: String, default: '' },
            value: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
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
        tags: [{ type: String, default: '' }]
    },
    {
        timestamps: true
    }
);

const Explore = mongoose.model('Explore', exploreSchema);
export default Explore;
