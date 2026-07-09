import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/service/axiosClient";

interface PendingProductsState {
  count: number;
}

const initialState: PendingProductsState = {
  count: 0,
};

// Gọi API lấy tổng số sản phẩm PENDING (chỉ cần totalElements, lấy size=1 cho nhẹ)
export const fetchPendingCount = createAsyncThunk(
  "pendingProducts/fetchCount",
  async () => {
    const res = await axiosClient.get<unknown, { data: { totalElements: number } }>(
      "/products/pending",
      { params: { page: 0, size: 1 } },
    );
    return res.data.totalElements as number;
  },
);

const pendingProductsSlice = createSlice({
  name: "pendingProducts",
  initialState,
  reducers: {
    // Dùng khi admin duyệt/từ chối 1 sản phẩm — giảm count đi 1 tức thì (optimistic)
    decrementPendingCount: (state) => {
      if (state.count > 0) state.count -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPendingCount.fulfilled, (state, action) => {
      state.count = action.payload;
    });
  },
});

export const { decrementPendingCount } = pendingProductsSlice.actions;
export default pendingProductsSlice;
