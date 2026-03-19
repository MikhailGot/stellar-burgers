import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrderResponse } from '@api';

interface BurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

interface MoveIngredient {
  index: number;
  direction: 'up' | 'down';
}

interface OrderError {
  success: boolean;
  message: string;
}

export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  TIngredient[],
  { rejectValue: OrderError }
>(
  'burger-constructor/createOrder',
  async (ingredients: TIngredient[], { rejectWithValue }) => {
    const data = ingredients.map((i) => i._id.toString());
    try {
      const response = await orderBurgerApi(data);
      return response;
    } catch (error) {
      const err = error as OrderError;
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
} satisfies BurgerConstructorState as BurgerConstructorState;

export const burgerConstructorSlice = createSlice({
  name: 'burger-constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.ingredients.push(item);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    moveIngredient(state, action: PayloadAction<MoveIngredient>) {
      const direction = action.payload.direction;
      const idx = action.payload.index;

      if (
        'down' === direction &&
        idx >= 0 &&
        idx < state.ingredients.length - 1
      ) {
        const temp = state.ingredients[idx + 1];
        state.ingredients[idx + 1] = state.ingredients[idx];
        state.ingredients[idx] = temp;
      }
      if ('up' === direction && idx > 0 && idx < state.ingredients.length) {
        const temp = state.ingredients[idx - 1];
        state.ingredients[idx - 1] = state.ingredients[idx];
        state.ingredients[idx] = temp;
      }
    },
    deleteIngredient(state, action: PayloadAction<number>) {
      const idx = action.payload;
      if (idx >= 0 && idx < state.ingredients.length) {
        state.ingredients.splice(action.payload, 1);
      }
    },
    resetState(state) {
      state.orderModalData = null;
      state.orderRequest = false;
      state.bun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderModalData = {
          ...action.payload.order,
          ingredients: state.ingredients.map((i) => i._id.toString())
        };
        state.orderRequest = false;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.pending, (state, action) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
      });
  }
});

export const { addIngredient, moveIngredient, deleteIngredient, resetState } =
  burgerConstructorSlice.actions;
