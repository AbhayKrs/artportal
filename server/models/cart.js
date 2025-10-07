import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        product: { type: String, required: true },
        quantity: { type: Number, default: 0, required: true }
    },
    {
        timestamps: true
    }
);

const cartSchema = new mongoose.Schema(
    {
        customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        items: [cartItemSchema],
        subtotal: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
)

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
