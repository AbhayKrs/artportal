import mongoose from 'mongoose';

const sharedSchema = new mongoose.Schema(
    {
        artwork_tags: [{ type: String, default: '' }],
        images: {
            login: { type: String, default: '' },
            signup: { type: String, default: '' }
        },
        stickers: [{
            _id: { type: mongoose.Schema.Types.ObjectId },
            icon: { type: String, default: '' },
            cost: { type: String, default: '' }
        }],
        user_avatars: [{
            _id: { type: mongoose.Schema.Types.ObjectId },
            icon: { type: String, default: '' },
            identity: { type: String, default: '' }
        }],
        locations: [{
            country: { type: String },
            country_code: { type: String },
            timezones: [{ type: String }]
        }]
    }
);

const Shared = mongoose.model('Shared', sharedSchema);
export default Shared;
