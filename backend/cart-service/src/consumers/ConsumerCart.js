import Cart from "../models/Cart";
import CartDetail from "../models/CartDetail";

export const consumeCartCleanup = async () => {
  channel.consume(process.env.CART_DELETE_QUEUE, async (msg) => {
    if (msg) {
      const { customer_id } = JSON.parse(msg.content.toString());

      console.log(customer_id);
      try {
        const carts = await Cart.find({ customer_id }, "_id");
        const cartIds = carts.map((c) => c._id);

        await CartDetail.deleteMany({ cart_id: { $in: cartIds } });

        await Cart.deleteMany({ _id: { $in: cartIds } });
      } catch (err) {
        console.error("Lỗi khi xoá cart:", err);
      }

      channel.ack(msg);
    }
  });
};
