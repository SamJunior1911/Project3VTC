import mongoose from "mongoose";

const CartDetailSchema = new mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  product_id: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalprice: { type: Number, required: true },
});

const CartDetail = mongoose.model("CartDetail", CartDetailSchema);
export default CartDetail;
