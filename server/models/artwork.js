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
        tags: [{ type: String, default: '' }],
        views: [{ type: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the artwork
        comments: [commentSchema],
    },
    {
        timestamps: true
    }
);

commentSchema.pre("save", async (next) => {
    try {
        const comment = this;
        await comment.populate('author', 'name username avatar').execPopulate();

        if (comment.author) {
            comment.authorName = doc.author.name;
            comment.authorUsername = doc.author.username;
            comment.authorAvatar = doc.author.avatar;
        }

        next();
    } catch (err) {
        next(err);
    }
})

artworkSchema.pre("save", async (next) => {
    try {
        const artwork = this;
        await artwork.populate('artist', 'name username avatar').execPopulate();

        if (artwork.artist) {
            artwork.artistName = doc.artist.name;
            artwork.artistUsername = doc.artist.username;
            artwork.artistAvatar = doc.artist.avatar;
        }

        next();
    } catch (err) {
        next(err);
    }
})

const Comment = mongoose.model('Comment', commentSchema);
const Artwork = mongoose.model('Artwork', artworkSchema);
export default { Artwork, Comment };
