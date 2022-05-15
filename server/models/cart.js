import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    title: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    subtotal: {
        type: String
    },
    seller: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
        },
        avatar: {
            icon: { type: String, default: '' },
            category: { type: String, default: '' }
        }
    },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
