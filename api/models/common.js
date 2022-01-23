import mongoose from 'mongoose';

const commonSchema = new mongoose.Schema(
    {
        tags: [{ type: String, default: '' }],
        images: {
            login: { type: String, default: '' },
            signup: { type: String, default: '' }
        },
        awards: [{
            icon: { type: String, default: '' },
            title: { type: String, default: '' }
        }],
        avatars: [{
            icon: { type: String, default: '' },
            category: { type: String, default: '' }
        }]
    }
);

const Common = mongoose.model('Common', commonSchema);
export default Common;
