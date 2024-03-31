import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/* 
    Gift Schema Model
    The gift model schema is a sticker which has a certain token price attached to it.
    The gifter will deduct from his token count to gift the artist.
    The artist will recieve the equivalent token value added to his token count and the sticker+message will be added under his artwork.
*/
const giftSchema = new Schema(
    {
        artwork_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
        artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        gifter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        gift_ref: { type: mongoose.Schema.Types.ObjectId, ref: "Sticker" },
        message: { type: String }
    },
    { timestamps: true }
);

const Gift = mongoose.model("Gift", giftSchema);
export default Gift;