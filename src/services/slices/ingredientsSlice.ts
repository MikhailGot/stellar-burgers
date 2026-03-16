import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface FetchError {
  success: boolean;
  message: string;
}

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: FetchError }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    const err = error as FetchError;
    return rejectWithValue(err);
  }
});
interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  isLoaded: boolean;
  errorMessage: string;
}

const initialState = {
  ingredients: [],
  isLoading: false,
  isLoaded: false,
  errorMessage: ''
} satisfies IngredientsState as IngredientsState;

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
        state.isLoaded = true;
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.isLoaded = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.errorMessage = action.payload?.message || 'Неизвестная ошибка';
      });
  }
});
