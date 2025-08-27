import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkStatusAsyncAction } from '@store';
import { TIngredient } from '@utils-types';

export const INGREDIENTS_SLICE_NAME = 'ingredients';

interface IngredientsState {
  list: TIngredient[];
  isLoading: boolean;
  error?: string;
}

const initialState: IngredientsState = {
  list: [],
  isLoading: false,
  error: undefined
};

const ingredientsSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.list = action.payload;
        state.isLoading = false;
      })
      .addMatcher(
        checkStatusAsyncAction('pending', INGREDIENTS_SLICE_NAME),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        checkStatusAsyncAction('rejected', INGREDIENTS_SLICE_NAME),
        (state, action: PayloadAction<{ message: string }>) => {
          state.error = action.payload.message;
          state.isLoading = false;
        }
      );
  }
});

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>(
  `${INGREDIENTS_SLICE_NAME}/fetchIngredients`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const ingredientsReducer = ingredientsSlice.reducer;
