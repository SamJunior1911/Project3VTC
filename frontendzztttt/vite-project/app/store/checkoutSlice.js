import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postOrderData } from "@/services/orderService";
import { patchCustomerData } from "@/services/customerService";
import { getCartData } from "@/services/cartService";
import { getCouponData } from "@/services/couponService";
export const fetchCartAsync = createAsyncThunk(
  "checkout/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const cartResponse = await getCartData("api/cart");
      return cartResponse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);
export const fetchCouponAsync = createAsyncThunk(
  "checkout/fetchCoupon",
  async (_, { rejectWithValue }) => {
    try {
      const couponResponse = await getCouponData("api/coupons/listcoupon");
      console.log("Coupon API response:", couponResponse);
      return couponResponse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupon"
      );
    }
  }
);
export const createCustomerAsync = createAsyncThunk(
  "checkout/createCustomer",
  async (customerPayload, { rejectWithValue }) => {
    try {
      const customerResponse = await patchCustomerData(customerPayload);
      return customerResponse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

export const createOrderAsync = createAsyncThunk(
  "checkout/createOrder",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const orderResponse = await postOrderData(orderPayload);
      return orderResponse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

const initialState = {
  cart: [],
  discount: 0,
  total: 0,
  subtotal: 0,
  discountAmount: 0,
  coupon: [],
  selectedCoupon: null,
  loading: {
    cart: false,
    coupon: false,
  },
  error: null,
};

const checkoutSlide = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    calculateTotal: (state) => {
      state.subtotal = state.cart.reduce((sum, item) => sum + item.total, 0);
      let discountAmount = 0;
      if (state.selectedCoupon) {
        let coupon = state.selectedCoupon;
        if (coupon.coupon_type === "percent") {
          discountAmount = (state.subtotal * state.discount) / 100;
        } else if (coupon.coupon_type === "fixed") {
          discountAmount = coupon.coupon_value;
        }
      }
      state.discountAmount = discountAmount;
      state.total = state.subtotal - discountAmount;
    },
    setSelectedCoupon: (state, action) => {
      state.selectedCoupon = action.payload;
      if (action.payload) {
        state.discount = action.payload.coupon_value || 0;
      } else {
        state.discount = 0;
      }
      checkoutSlide.caseReducers.calculateTotal(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCouponAsync.pending, (state) => {
        state.loading.coupon = true;
        state.error = null;
      })
      .addCase(fetchCouponAsync.fulfilled, (state, action) => {
        state.loading.coupon = false;

        state.coupon = action.payload?.data || [];
      })
      .addCase(fetchCouponAsync.rejected, (state, action) => {
        state.loading.coupon = false;
        state.error = action.payload;
      });

    // --- Fetch Cart ---
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading.cart = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading.cart = false;
        state.cart = action.payload?.cart || [];
        checkoutSlide.caseReducers.calculateTotal(state);
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading.cart = false;
        state.error = action.payload;
      });
    // --- Create Customer ---
    builder
      .addCase(createCustomerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createCustomerAsync.fulfilled, (state, action) => {
        state.customer = action.payload;
      })
      .addCase(createCustomerAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    // --- Create Order ---
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setDiscount, setCart, calculateTotal, setSelectedCoupon } =
  checkoutSlide.actions;

export default checkoutSlide.reducer;
