import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TApiError, TOrder } from '@utils-types';

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: TApiError }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    const err = error as TApiError;
    return rejectWithValue(err);
  }
});

interface FeedsState {
  orders: TOrder[];
  isLoading: boolean;
  isLoaded: boolean;
  errorMessage: string;
}

const initialState = {
  orders: [],
  isLoading: false,
  isLoaded: false,
  errorMessage: ''
} satisfies FeedsState as FeedsState;

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.isLoaded = true;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.isLoaded = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.errorMessage = action.payload?.message || 'Неизвестная ошибка';
      });
  }
});
