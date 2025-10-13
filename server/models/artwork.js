import mongoose from 'mongoose';

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
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the artwork
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    },
    {
        timestamps: true
    }
);

const Artwork = mongoose.model('Artwork', artworkSchema);
export default Artwork;
