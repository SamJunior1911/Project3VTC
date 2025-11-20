// import axios from "axios";
// import Cart from "../models/Cart.js";
// import CartDetail from "../models/CartDetail.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "./src/.env" });

// const API_PRODUCTS =
//   process.env.API_PRODUCTS || "http://localhost:3001/api/products";

// export const AddToCart = async (req, res) => {
//   console.log(req.body);
//   try {
//     const productId = req.params.id;
//     const quantity = parseInt(req.body.quantity) || 1;

//     const { data: product } = await axios.get(`${API_PRODUCTS}/${productId}`);
//     const totalprice = Math.round(
//       product.price * quantity * (1 - (product.discount || 0) / 100)
//     );

//     if (!req.customer_id) {
//       if (!req.session.cart) req.session.cart = [];

//       let item = req.session.cart.find((p) => p.product_id === productId);

//       if (item) {
//         item.quantity += quantity;
//         item.total = Math.round(
//           item.price * item.quantity * (1 - item.discount / 100)
//         );
//       } else {
//         req.session.cart.push({
//           product_id: productId,
//           title: product.title,
//           price: product.price,
//           quantity,
//           discount: product.discount || 0,
//           total: totalprice,
//         });
//       }

//       await req.session.save();

//       return res.json({
//         message: "🛒 Đã thêm sản phẩm vào giỏ hàng session",
//         cart: req.session.cart,
//       });
//     }

//     let cart = await Cart.findOne({ customer_id: req.customer_id });
//     if (!cart) cart = await Cart.create({ customer_id: req.customer_id });

//     let detail = await CartDetail.findOne({
//       cart_id: cart._id,
//       product_id: productId,
//     });

//     if (detail) {
//       detail.quantity += quantity;
//       detail.totalprice = Math.round(
//         detail.price * detail.quantity * (1 - detail.discount / 100)
//       );
//       await detail.save();
//     } else {
//       await CartDetail.create({
//         cart_id: cart._id,
//         product_id: productId,
//         quantity,
//         price: product.price,
//         discount: product.discount || 0,
//         totalprice,
//       });
//     }

//     res.json({ message: "✅ Đã thêm vào giỏ hàng", cart_id: cart._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };

// export const GetCart = async (req, res) => {
//   try {
//     if (!req.customer_id) {
//       const sessionCart = req.session.cart || [];
//       return res.json({ message: "🛒 Giỏ hàng session", cart: sessionCart });
//     }

//     const cart = await Cart.findOne({ customer_id: req.customer_id });
//     if (!cart) return res.json({ message: "🛒 Giỏ hàng trống", cart: [] });

//     const details = await CartDetail.find({ cart_id: cart._id });

//     const detailedCart = await Promise.all(
//       details.map(async (item) => {
//         try {
//           const { data: product } = await axios.get(
//             `${API_PRODUCTS}/${item.product_id}`
//           );
//           return {
//             product_id: item.product_id,
//             title: product.title,
//             price: item.price,
//             quantity: item.quantity,
//             discount: item.discount || 0,
//             total:
//               item.totalprice ||
//               Math.round(
//                 item.price * item.quantity * (1 - item.discount / 100)
//               ),
//           };
//         } catch {
//           return {
//             product_id: item.product_id,
//             title: "Sản phẩm không tồn tại",
//             price: 0,
//             quantity: item.quantity,
//             discount: 0,
//             total: 0,
//           };
//         }
//       })
//     );

//     res.json({ message: "✅ Lấy giỏ hàng thành công", cart: detailedCart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };

// export const RemoveFromCart = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     if (!req.customer_id) {
//       req.session.cart = (req.session.cart || []).filter(
//         (p) => p.product_id !== productId
//       );
//       await req.session.save();
//       return res.json({
//         message: "✅ Xóa sản phẩm khỏi session",
//         cart: req.session.cart,
//       });
//     }

//     const cart = await Cart.findOne({ customer_id: req.customer_id });
//     if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

//     await CartDetail.deleteOne({ cart_id: cart._id, product_id: productId });
//     const updatedCart = await CartDetail.find({ cart_id: cart._id });
//     res.json({ message: "✅ Xóa sản phẩm thành công", cart: updatedCart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };

// export const updateCartDetail = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const quantity = parseInt(req.body.quantity);

//     if (!quantity || quantity < 1)
//       return res.status(400).json({ message: "Số lượng không hợp lệ" });

//     if (!req.customer_id) {
//       req.session.cart = (req.session.cart || []).map((item) => {
//         if (item.product_id === productId) item.quantity = quantity;
//         return item;
//       });
//       await req.session.save();
//       return res.json({ cart: req.session.cart });
//     }

//     const cart =
//       (await Cart.findOne({ customer_id: req.customer_id })) ||
//       (await Cart.create({ customer_id: req.customer_id }));
//     const { data: product } = await axios.get(`${API_PRODUCTS}/${productId}`);
//     const totalprice = Math.round(
//       product.price * quantity * (1 - (product.discount || 0) / 100)
//     );

//     let detail = await CartDetail.findOne({
//       cart_id: cart._id,
//       product_id: productId,
//     });
//     if (detail) {
//       detail.quantity = quantity;
//       detail.totalprice = totalprice;
//       await detail.save();
//     } else {
//       await CartDetail.create({
//         cart_id: cart._id,
//         product_id: productId,
//         quantity,
//         price: product.price,
//         discount: product.discount || 0,
//         totalprice,
//       });
//     }

//     const updatedCart = await CartDetail.find({ cart_id: cart._id });
//     res.json({ cart: updatedCart });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Cập nhật giỏ hàng thất bại", error: err.message });
//   }
// };

// export const SyncCart = async (req, res) => {
//   try {
//     console.log("req.customer_id:", req.customer_id);
//     console.log("req.body.cart:", req.body.cart);

//     const pendingCart = req.body.cart || [];
//     const customerId = req.customer_id;

//     if (!customerId) {
//       console.log(" Chưa login, không có customer_id");
//       return res.status(400).json({ message: "Chưa login" });
//     }

//     if (pendingCart.length === 0) {
//       console.log("Pending cart trống");
//       return res.status(400).json({ message: "Cart trống" });
//     }

//     let cart =
//       (await Cart.findOne({ customer_id: customerId })) ||
//       (await Cart.create({ customer_id: customerId }));

//     console.log("Cart tìm/ tạo:", cart);

//     for (const item of pendingCart) {
//       console.log("Xử lý item:", item);

//       const totalprice = Math.round(
//         item.price * item.quantity * (1 - (item.discount || 0) / 100)
//       );

//       let detail = await CartDetail.findOne({
//         cart_id: cart._id,
//         product_id: item.product_id,
//       });

//       if (detail) {
//         console.log(" Detail đã tồn tại, cập nhật số lượng và tổng tiền");
//         detail.quantity += item.quantity;
//         detail.totalprice = Math.round(
//           detail.price * detail.quantity * (1 - detail.discount / 100)
//         );
//         await detail.save();
//       } else {
//         console.log(" Tạo mới detail:", {
//           cart_id: cart._id,
//           product_id: item.product_id,
//           quantity: item.quantity,
//           price: item.price,
//           discount: item.discount || 0,
//           totalprice,
//         });
//         await CartDetail.create({
//           cart_id: cart._id,
//           product_id: item.product_id,
//           quantity: item.quantity,
//           price: item.price,
//           discount: item.discount || 0,
//           totalprice,
//         });
//       }
//     }

//     const updatedCart = await CartDetail.find({ cart_id: cart._id });
//     console.log(" SyncCart thành công, updatedCart:", updatedCart);

//     res.json({ message: " Sync cart thành công", cart: updatedCart });
//   } catch (err) {
//     console.error(" Lỗi SyncCart:", err);
//     res.status(500).json({ message: "Sync cart thất bại", error: err.message });
//   }
// };


import axios from "axios";
import Cart from "../models/Cart.js";
import CartDetail from "../models/CartDetail.js";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });

const API_PRODUCTS =
  process.env.API_PRODUCTS || "http://localhost:3001/api/products";
export const AddToCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity) || 1;

    // Lấy thông tin sản phẩm mới nhất
    const { data: product } = await axios.get(`${API_PRODUCTS}/${productId}`);
    const totalprice = Math.round(
      product.price * quantity * (1 - (product.discount || 0) / 100)
    );

    // ================== KHÁCH VÃNG LAI (SESSION) ==================
    if (!req.customer_id) {
      if (!req.session.cart) req.session.cart = [];

      // TÌM INDEX thay vì dùng find() (vì find trả về reference → dễ mutate)
      const index = req.session.cart.findIndex(p => p.product_id === productId);

      if (index !== -1) {
        // KHÔNG MUTATE → TẠO OBJECT MỚI
        const oldItem = req.session.cart[index];
        req.session.cart[index] = {
          ...oldItem,
          quantity: oldItem.quantity + quantity,
          total: Math.round(
            oldItem.price * (oldItem.quantity + quantity) * (1 - oldItem.discount / 100)
          )
        };
      } else {
        // Thêm mới
        req.session.cart.push({
          product_id: productId,
          title: product.title,
          price: product.price,
          quantity,
          discount: product.discount || 0,
          total: totalprice,
        });
      }

      await req.session.save();
      return res.json({
        message: "Đã thêm vào giỏ hàng (khách vãng lai)",
        cart: req.session.cart,
      });
    }

    // ================== ĐÃ ĐĂNG NHẬP ==================
    let cart = await Cart.findOne({ customer_id: req.customer_id });
    if (!cart) cart = await Cart.create({ customer_id: req.customer_id });

    let detail = await CartDetail.findOne({
      cart_id: cart._id,
      product_id: productId,
    });

    if (detail) {
      detail.quantity += quantity;
      detail.totalprice = Math.round(
        detail.price * detail.quantity * (1 - detail.discount / 100)
      );
      await detail.save();
    } else {
      await CartDetail.create({
        cart_id: cart._id,
        product_id: productId,
        quantity,
        price: product.price,
        discount: product.discount || 0,
        totalprice,
      });
    }

    res.json({
      message: "Đã thêm vào giỏ hàng",
      cart_id: cart._id,
    });
  } catch (err) {
    console.error("Lỗi AddToCart:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const GetCart = async (req, res) => {
  try {
    if (!req.customer_id) {
      const sessionCart = req.session.cart || [];
      return res.json({ message: "🛒 Giỏ hàng session", cart: sessionCart });
    }

    const cart = await Cart.findOne({ customer_id: req.customer_id });
    if (!cart) return res.json({ message: "🛒 Giỏ hàng trống", cart: [] });

    const details = await CartDetail.find({ cart_id: cart._id });

    const detailedCart = await Promise.all(
      details.map(async (item) => {
        try {
          const { data: product } = await axios.get(
            `${API_PRODUCTS}/${item.product_id}`
          );
          return {
            product_id: item.product_id,
            title: product.title,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount || 0,
            total:
              item.totalprice ||
              Math.round(
                item.price * item.quantity * (1 - item.discount / 100)
              ),
          };
        } catch {
          return {
            product_id: item.product_id,
            title: "Sản phẩm không tồn tại",
            price: 0,
            quantity: item.quantity,
            discount: 0,
            total: 0,
          };
        }
      })
    );

    res.json({ message: "✅ Lấy giỏ hàng thành công", cart: detailedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const RemoveFromCart = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.customer_id) {
      req.session.cart = (req.session.cart || []).filter(
        (p) => p.product_id !== productId
      );
      await req.session.save();
      return res.json({
        message: "✅ Xóa sản phẩm khỏi session",
        cart: req.session.cart,
      });
    }

    const cart = await Cart.findOne({ customer_id: req.customer_id });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

    await CartDetail.deleteOne({ cart_id: cart._id, product_id: productId });
    const updatedCart = await CartDetail.find({ cart_id: cart._id });
    res.json({ message: "✅ Xóa sản phẩm thành công", cart: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const updateCartDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity) || 1;

    if (quantity < 1) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    // ================== KHÁCH VÃNG LAI (session) ==================
    if (!req.customer_id) {
      if (!req.session.cart) req.session.cart = [];

      // Tìm index của sản phẩm
      const index = req.session.cart.findIndex(p => p.product_id === productId);

      if (index !== -1) {
        // Cập nhật số lượng (không mutate, tạo object mới)
        req.session.cart[index] = {
          ...req.session.cart[index],
          quantity: quantity
        };
      } else {
        // Nếu chưa có thì thêm mới (trường hợp hiếm)
        const { data: product } = await axios.get(`${API_PRODUCTS}/${productId}`);
        req.session.cart.push({
          product_id: productId,
          title: product.title,
          price: product.price,
          quantity,
          discount: product.discount || 0,
          total: Math.round(product.price * quantity * (1 - (product.discount || 0) / 100))
        });
      }

      await req.session.save();
      return res.json({
        message: "Cập nhật giỏ hàng session thành công",
        cart: req.session.cart
      });
    }

    // ================== NGƯỜI DÙNG ĐÃ LOGIN ==================
    let cart = await Cart.findOne({ customer_id: req.customer_id });
    if (!cart) {
      cart = await Cart.create({ customer_id: req.customer_id });
    }

    const { data: product } = await axios.get(`${API_PRODUCTS}/${productId}`);
    const totalprice = Math.round(
      product.price * quantity * (1 - (product.discount || 0) / 100)
    );

    let detail = await CartDetail.findOne({
      cart_id: cart._id,
      product_id: productId,
    });

    if (detail) {
      detail.quantity = quantity;
      detail.price = product.price;        // cập nhật lại giá mới nhất
      detail.discount = product.discount || 0;
      detail.totalprice = totalprice;
      await detail.save();
    } else {
      await CartDetail.create({
        cart_id: cart._id,
        product_id: productId,
        quantity,
        price: product.price,
        discount: product.discount || 0,
        totalprice,
      });
    }

    const updatedDetails = await CartDetail.find({ cart_id: cart._id });
    res.json({
      message: "Cập nhật giỏ hàng thành công",
      cart: updatedDetails
    });

  } catch (err) {
    console.error("Lỗi updateCartDetail:", err);
    res.status(500).json({
      message: "Cập nhật giỏ hàng thất bại",
      error: err.message
    });
  }
};
export const SyncCart = async (req, res) => {
  try {
    const pendingCart = req.body.cart || [];
    const customerId = req.customer_id;

    if (!customerId) return res.status(401).json({ message: "Chưa đăng nhập" });
    if (!Array.isArray(pendingCart) || pendingCart.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống" });

    let cart = await Cart.findOne({ customer_id: customerId });
    if (!cart) cart = await Cart.create({ customer_id: customerId });

    for (const item of pendingCart) {
      // BẮT BUỘC lấy thông tin mới nhất từ Product Service
      let product;
      try {
        const { data } = await axios.get(`${API_PRODUCTS}/${item.product_id}`);
        product = data;
      } catch (err) {
        console.error("Sản phẩm không tồn tại:", item.product_id);
        continue; // bỏ qua sản phẩm lỗi
      }

      const totalprice = Math.round(
        product.price * item.quantity * (1 - (product.discount || 0) / 100)
      );

      let detail = await CartDetail.findOne({
        cart_id: cart._id,
        product_id: item.product_id,
      });

      if (detail) {
        detail.quantity += item.quantity;
        detail.price = product.price;
        detail.discount = product.discount || 0;
        detail.totalprice = Math.round(
          detail.price * detail.quantity * (1 - detail.discount / 100)
        );
        await detail.save();
      } else {
        await CartDetail.create({
          cart_id: cart._id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          discount: product.discount || 0,
          totalprice,
        });
      }
    }

    const finalCart = await CartDetail.find({ cart_id: cart._id });
    res.json({ message: "Đồng bộ giỏ hàng thành công", cart: finalCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi đồng bộ giỏ hàng" });
  }
};