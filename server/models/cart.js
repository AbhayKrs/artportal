import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        item_name: { type: String, required: true },
        item_size: { type: String, required: true },
        item_type: { type: String, required: true },
        unit_price: { type: Number, default: 0, required: true },
        quantity: { type: Number, default: 0, required: true },
        seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

const CartItem = mongoose.model('CartItem', cartItemSchema);
const Cart = mongoose.model('Cart', cartSchema);
export default { Cart, CartItem };
