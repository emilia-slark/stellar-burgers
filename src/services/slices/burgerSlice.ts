import { orderBurgerApi, TAuthResponse } from '@api';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export const BURGER_SLICE_NAME = 'burger';

interface BurgerState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  lastOrder: TOrder | null;
  isOrdering: boolean;
  error?: string;
}

const initialState: BurgerState = {
  bun: null,
  ingredients: [],
  lastOrder: null,
  isOrdering: false
};

const burgerSlice = createSlice({
  name: BURGER_SLICE_NAME,
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, id: key } };
      }
    },
    moveIngredient(
      state,
      action: PayloadAction<{
        to: number;
        from: number;
      }>
    ) {
      const { to, from } = action.payload;
      const newIngredients = [...state.ingredients];
      [newIngredients[from], newIngredients[to]] = [
        newIngredients[to],
        newIngredients[from]
      ];
      state.ingredients = newIngredients;
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.ingredients = state.ingredients.filter(
        (_, index) => index !== action.payload
      );
    },
    clearOrderData(state) {
      state.lastOrder = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.isOrdering = true;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isOrdering = false;
        state.error = action.payload;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.lastOrder = action.payload;
        state.bun = initialState.bun;
        state.ingredients = initialState.ingredients;
        state.isOrdering = false;
      });
  }
});

export const orderBurger = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>(
  `${BURGER_SLICE_NAME}/orderBurger`,
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      const rejectedMessage = error as TAuthResponse;
      return rejectWithValue(rejectedMessage.message || 'Unknown error');
    }
  }
);

export const burgerReducer = burgerSlice.reducer;
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun,
  clearOrderData
} = burgerSlice.actions;
