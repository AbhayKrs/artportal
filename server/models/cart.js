import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store"
        },
        product_category: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        unit_price: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
