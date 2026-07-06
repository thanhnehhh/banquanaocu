import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQty,
  clearCart,
} from "@/services/cartService";
import type { CartDTO } from "@/services/cartService";

interface CartState {
  cart: CartDTO | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await getCart();
  return res.data;
});

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ maSanPham, soLuong }: { maSanPham: number; soLuong: number }) => {
    const res = await addToCart(maSanPham, soLuong);
    return res.data;
  },
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (maItem: number) => {
    const res = await removeFromCart(maItem);
    return res.data;
  },
);

export const updateItemQty = createAsyncThunk(
  "cart/updateQty",
  async ({ maItem, soLuong }: { maItem: number; soLuong: number }) => {
    const res = await updateCartItemQty(maItem, soLuong);
    return res.data;
  },
);

export const emptyCart = createAsyncThunk("cart/emptyCart", async () => {
  await clearCart();
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    // Optimistic remove — xóa ngay trước khi API trả về
    optimisticRemoveItem: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(
          (item) => item.maItem !== action.payload
        );
        state.cart.tongSoLuong = state.cart.items.reduce(
          (sum, item) => sum + item.soLuong, 0
        );
        state.cart.tongTien = state.cart.items.reduce(
          (sum, item) => sum + item.giaSanPham * item.soLuong, 0
        );
      }
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (
      state: CartState,
      action: PayloadAction<CartDTO>,
    ) => {
      state.loading = false;
      state.cart = action.payload;
    };
    const handleRejected = (state: CartState) => {
      state.loading = false;
      state.error = "Có lỗi xảy ra với giỏ hàng";
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addItemToCart.pending, handlePending)
      .addCase(addItemToCart.fulfilled, handleFulfilled)
      .addCase(addItemToCart.rejected, handleRejected)
      .addCase(removeItemFromCart.pending, (state) => {
        // Không set loading=true khi xóa để tránh nháy UI
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, handleFulfilled)
      .addCase(removeItemFromCart.rejected, handleRejected)
      .addCase(updateItemQty.pending, handlePending)
      .addCase(updateItemQty.fulfilled, handleFulfilled)
      .addCase(updateItemQty.rejected, handleRejected)
      .addCase(emptyCart.fulfilled, (state) => {
        state.cart = null;
        state.loading = false;
      });
  },
});

export const { resetCart, optimisticRemoveItem } = cartSlice.actions;
export default cartSlice;
