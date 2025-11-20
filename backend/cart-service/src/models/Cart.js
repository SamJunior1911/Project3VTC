// Cart.js
import mongoose from "mongoose";
import CartDetail from "./CartDetail.js";

const cartSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

cartSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
  try {
    await CartDetail.deleteMany({ cart_id: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
