import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TApiError, TOrder } from '@utils-types';

interface FetchFeeds {
  orders: TOrder[];
  total: number;
  totalToday: number;
}
export const fetchFeeds = createAsyncThunk<
  FetchFeeds,
  void,
  { rejectValue: TApiError }
>('feed/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return { ...response };
  } catch (error) {
    const err = error as TApiError;
    return rejectWithValue(err);
  }
});

interface FeedTotal {
  total: number;
  totalToday: number;
}

interface FeedsState {
  orders: TOrder[];
  feed: FeedTotal;
  isLoading: boolean;
  isLoaded: boolean;
  errorMessage: string;
}

const initialState = {
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  isLoaded: false,
  errorMessage: ''
} satisfies FeedsState as FeedsState;

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
        state.isLoading = false;
        state.isLoaded = true;
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.isLoaded = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.errorMessage = action.payload?.message || 'Неизвестная ошибка';
      });
  }
});
