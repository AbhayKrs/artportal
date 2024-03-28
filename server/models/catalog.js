import mongoose from 'mongoose';

const catalogSchema = new mongoose.Schema(
    {
        artist: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            name: { type: String },
            username: { type: String },
            avatar: { icon: { type: String, default: '' }, category: { type: String, default: '' } },
        },
        files: [{ type: String, default: '' }],
        title: { type: String, required: true },
        description: { type: String, required: true },
        categories: [{ type: String, default: '' }],
        tags: [{ type: String, default: '' }],
        views: [{
            type: String
        }],
    },
    {
        timestamps: true
    }
);

const Catalog = mongoose.model('Catalog', catalogSchema);
export default Catalog;
