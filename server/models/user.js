import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, default: "", required: true },
        username: { type: String, default: "", required: true },
        email: { type: String, default: "", required: true },
        password: { type: String },
        bio: { type: String, default: "" },
        avatar: {
            icon: { type: String, default: '' },
            category: { type: String, default: '' }
        },
        tokens: { type: Number, default: 0 },
        google_id: { type: String },
        google_authenticated: { type: Boolean, default: false },
        is_verified: { type: Boolean, default: false },
        is_admin: { type: Boolean, default: false },
        is_seller: { type: Boolean, default: false },
        is_premium: { type: Boolean, default: false },
        premium_validity: { type: Date },
        received_gifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }],
        followers: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            followedOn: { type: Date }
        }],
        following: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            followedOn: { type: Date }
        }],
        artwork_bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
        post_bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
        refresh_token: { type: String }
    },
    {
        timestamps: true,
        strict: false
    }
);

const User = mongoose.model("User", UserSchema);
export default User;