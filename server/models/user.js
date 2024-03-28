import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: { type: String, default: "", required: true },
        username: { type: String, default: "", required: true },
        email: { type: String, default: "", required: true },
        password: { type: String, required: true },
        bio: { type: String, default: "" },
        avatar: { icon: { type: String, default: '' }, category: { type: String, default: '' } },
        tokens: { type: Number, default: 0 },
        google_id: { type: String },
        google_authenticated: { type: Boolean, default: false },
        awards: [{
            id: { type: mongoose.Schema.Types.ObjectId },
            awarder_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            catalog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog" },
            count: { type: Number, default: 0 }
        }],
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Catalog"
        }],
        isAdmin: { type: Boolean, default: false },
        isSeller: { type: Boolean, default: false },
        seller_rating: { type: Number },
    },
    {
        timestamps: true,
        strict: false
    }
);

const User = mongoose.model("User", UserSchema);
export default User;