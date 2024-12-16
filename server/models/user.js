import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        avatar: {
            icon: { type: String, default: '' },
            category: { type: String, default: '' }
        },
        name: { type: String, default: "", required: true },
        username: { type: String, default: "", required: true },
        email: { type: String, default: "", required: true },
        password: { type: String, required: true },
        bio: { type: String, default: "" },
        tokens: { type: Number, default: 0 },
        google_id: { type: String },
        google_authenticated: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false },
        isSeller: { type: Boolean, default: false },
        isPremium: { type: Boolean, default: false },
        premiumValidity: { type: Date },
        received_gifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }],
        followers: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            followedOn: { type: Date }
        }],
        following: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            followedOn: { type: Date }
        }],
        bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }]
    },
    {
        timestamps: true,
        strict: false
    }
);

const User = mongoose.model("User", UserSchema);
export default User;