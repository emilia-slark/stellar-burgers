import { getFeedsApi, TFeedsResponse } from '@api';
import {
  Action,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { checkStatusAsyncAction } from '@store';

export const FEED_SLICE_NAME = 'feed';

interface FeedState {
  feed: TFeedsResponse | null;
  isLoading: boolean;
  error?: string;
}

const initialState: FeedState = {
  feed: null,
  isLoading: false,
  error: undefined
};

const feedSlice = createSlice({
  name: FEED_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed = action.payload;
        state.isLoading = false;
      })
      .addMatcher(
        checkStatusAsyncAction('pending', FEED_SLICE_NAME),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        checkStatusAsyncAction('rejected', FEED_SLICE_NAME),
        (state, action: PayloadAction<{ message: string }>) => {
          state.isLoading = false;
          state.error = action.payload.message;
        }
      );
  }
});

export const fetchFeed = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>(`${FEED_SLICE_NAME}/fetchFeed`, async (_, { rejectWithValue, signal }) => {
  try {
    const response = await getFeedsApi(signal);
    return response;
  } catch (error) {
    return rejectWithValue(error as string);
  }
});

export const feedReducer = feedSlice.reducer;
