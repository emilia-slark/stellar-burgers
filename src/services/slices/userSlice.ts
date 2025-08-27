import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TServerResponse,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkStatusAsyncAction } from '@store';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '@cookie';

export const USER_SLICE_NAME = 'user';

interface UserState {
  user: TUser;
  orders: TOrder[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingOrders: boolean;
  errorAuth?: string;
  errorRegister?: string;
}

const initialState: UserState = {
  user: {
    name: '',
    email: ''
  },
  orders: [],
  isAuthenticated: false,
  isLoading: false,
  isLoadingOrders: false
};

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = initialState.user;
      state.orders = initialState.orders;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isLoadingOrders = false;
      state.errorAuth = undefined;
      state.errorRegister = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {})
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoadingOrders = false;
      })
      .addMatcher(
        checkStatusAsyncAction('pending', USER_SLICE_NAME),
        (state, action) => {
          if (action.type.includes('fetchOrders')) state.isLoadingOrders = true;
          // else if
          else state.isLoading = true;
        }
      )
      .addMatcher(
        checkStatusAsyncAction('rejected', USER_SLICE_NAME),
        (state, action: PayloadAction<string>) => {
          if (action.type.includes('fetchOrders')) {
            state.isLoadingOrders = false;
            state.errorAuth = action.payload;
          } else if (action.type.includes('registerUser')) {
            state.errorRegister = action.payload;
          }
          state.isLoading = false;
        }
      );
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  `${USER_SLICE_NAME}/fetchUser`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      const rejectedMessage = error as TAuthResponse;
      return rejectWithValue(rejectedMessage.message || 'Unknown error');
    }
  }
);

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>(
  `${USER_SLICE_NAME}/registerUser`,
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await registerUserApi(userData);

      dispatch(resetUser());
      setCookie('accessToken', response.accessToken);
      setCookie('refreshToken', response.refreshToken);

      return response.user;
    } catch (error) {
      const rejectedMessage = error as TAuthResponse;
      return rejectWithValue(rejectedMessage.message || 'Unknown error');
    }
  }
);

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>(`${USER_SLICE_NAME}/loginUser`, async (userData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(userData);

    setCookie('accessToken', response.accessToken);
    setCookie('refreshToken', response.refreshToken);

    return response.user;
  } catch (error) {
    const rejectedMessage = error as TAuthResponse;
    return rejectWithValue(rejectedMessage.message || 'Unknown error');
  }
});

export const logoutUser = createAsyncThunk<
  TServerResponse<{}>,
  void,
  { rejectValue: string }
>(`${USER_SLICE_NAME}/logoutUser`, async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await logoutApi();

    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    dispatch(resetUser());

    return response;
  } catch (error) {
    const rejectedMessage = error as TAuthResponse;
    return rejectWithValue(rejectedMessage.message || 'Unknown error');
  }
});

export const updateUserInfo = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>(
  `${USER_SLICE_NAME}/updateUserInfo`,
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      const rejectedMessage = error as TAuthResponse;
      return rejectWithValue(rejectedMessage.message || 'Unknown error');
    }
  }
);

export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>(`${USER_SLICE_NAME}/fetchOrders`, async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    const rejectedMessage = error as TAuthResponse;
    return rejectWithValue(rejectedMessage.message || 'Unknown error');
  }
});

export const userReducer = userSlice.reducer;
export const { resetUser } = userSlice.actions;
