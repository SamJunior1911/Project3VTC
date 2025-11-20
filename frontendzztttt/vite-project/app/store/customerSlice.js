import {
  deleteAddress,
  getAddressData,
  getCustomerData,
  patchAddressData,
  postAddressData,
} from "@/services/customerService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const fetchCustomerAsync = createAsyncThunk(
//   "customer/fetchCustomer",
//   async (_, { rejectWithValue }) => {
//     try {
//       const customerResponse = await getCustomerData("api/v1/customer/profile");
//       return customerResponse;
//     } catch (error) {
//       return rejectWithValue(
//         error.message || "Lỗi khi lấy thông tin khách hàng"
//       );
//     }
//   }
// );

export const addAddressCustomerAsync = createAsyncThunk(
  "customer/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await postAddressData(addressData);
      return response;
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Lỗi khi thêm địa chỉ"
      );
    }
  }
);

export const fetchAddressesAsync = createAsyncThunk(
  "customer/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAddressData("api/customer/addresses");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi lấy danh sách địa chỉ"
      );
    }
  }
);

export const updateAddressAsync = createAsyncThunk(
  "customer/updateAddresses",
  async (addressPayload, { rejectWithValue }) => {
    try {
      const { address_id, addressData } = addressPayload;
      const response = await patchAddressData(
        `api/customer/address/${address_id}`,
        addressData
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi cập nhật địa chỉ"
      );
    }
  }
);

export const deleteAddressAsync = createAsyncThunk(
  "customer/deleteAddresses",
  async (addressIdPayload, { rejectWithValue }) => {
    try {
      const { address_id } = addressIdPayload;
      const response = await deleteAddress(
        `api/customer/address/${address_id}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi cập nhật địa chỉ"
      );
    }
  }
);

// export const createCustomerAsync = createAsyncThunk(
//   "checkout/createCustomer",
//   async (customerPayload, { rejectWithValue }) => {
//     try {
//       const customerResponse = await patchCustomerData(customerPayload);
//       return customerResponse;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to create customer"
//       );
//     }
//   }
// );

const initialState = {
  addresses: [],
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // // Fetch customer
      // .addCase(fetchCustomerAsync.pending, (state) => {
      //   state.error = null;
      // })
      // .addCase(fetchCustomerAsync.fulfilled, (state, action) => {
      //   state.customer = action.payload.data || action.payload || null;
      // })
      // .addCase(fetchCustomerAsync.rejected, (state, action) => {
      //   state.error = action.payload;
      // })

      // Fetch addresses
      .addCase(fetchAddressesAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAddressesAsync.fulfilled, (state, action) => {
        state.addresses = action.payload.data || action.payload || [];
      })
      .addCase(fetchAddressesAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Add address
      .addCase(addAddressCustomerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addAddressCustomerAsync.fulfilled, (state, action) => {
        state.addresses.push(action.payload.data || action.payload);
      })
      .addCase(addAddressCustomerAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update address
      .addCase(updateAddressAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        const updatedAddress = action.payload.data || action.payload;
        const index = state.addresses.findIndex(
          (addr) => addr.id === updatedAddress.id
        );

        if (index !== -1) {
          state.addresses[index] = updatedAddress;
        }
      })
      .addCase(updateAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete address
      .addCase(deleteAddressAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        const deletedAddressId = action.payload.deletedAddress._id;
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== deletedAddressId
        );
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
