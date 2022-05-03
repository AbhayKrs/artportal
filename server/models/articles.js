import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    content: {
        type: String,
        default: '',
        required: true
    },
    files: [{
        filename: { type: String },
        cite: { type: String }
    }],
    category: {
        type: String,
        default: '',
        required: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: { type: String },
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    links: [{
        placeholder: { type: String },
        url: { type: String },
    }]
})

const Article = mongoose.model('Article', articleSchema);
export default Article;