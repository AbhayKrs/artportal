import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    value: { type: String, unique: true, trim: true }
});

const stickerSchema = new mongoose.Schema({
    icon: { type: String, default: '' },
    cost: { type: String, default: '' }
});

const avatarSchema = new mongoose.Schema({
    icon: { type: String, default: '' },
    identity: { type: String, default: '' }
});

const locationSchema = new mongoose.Schema({
    country: { type: String },
    country_code: { type: String },
    timezones: [{ type: String }]
});

const Tag = mongoose.model('Tag', tagSchema);
const Sticker = mongoose.model('Sticker', stickerSchema);
const Avatar = mongoose.model('Avatar', avatarSchema);
const Location = mongoose.model('Location', locationSchema);

export default {
    Tag,
    Sticker,
    Avatar,
    Location
};
