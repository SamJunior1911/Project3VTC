import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "./checkoutSlice.js";
import customerReducer from "./customerSlice.js";

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
    customer: customerReducer,
  },
});
