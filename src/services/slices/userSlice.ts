import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TApiError, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuth: boolean;
  isAuthLoading: boolean;
  isInitialized: boolean;
  errorText: string;
}

const initialState = {
  user: null,
  isAuth: false,
  isAuthLoading: false,
  isInitialized: false,
  errorText: ''
} satisfies UserState as UserState;

export const getUser = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: TApiError }
>('user/getUser', async (_, { rejectWithValue }) => {
  if (localStorage.getItem('refreshToken')) {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      const err = error as TApiError;
      return rejectWithValue(err);
    }
  }
  return null;
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: TApiError }
>('user/loginUser', async (loginData: TLoginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch (error) {
    const err = error as TApiError;
    return rejectWithValue(err);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: TApiError }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    const err = error as TApiError;
    return rejectWithValue(err);
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: TApiError }
>(
  'user/registerUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(registerData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      const err = error as TApiError;
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: TApiError }
>(
  'user/updateUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(registerData);
      return response.user;
    } catch (error) {
      const err = error as TApiError;
      return rejectWithValue(err);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthLoading = false;
        state.errorText = '';
        state.isInitialized = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthLoading = true;
        state.isAuth = false;
        state.errorText = '';
        state.isInitialized = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isAuth = false;
        state.errorText = action.payload?.message || 'Неизвестная ошибка';
        state.isInitialized = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthLoading = false;
        state.errorText = '';
        state.isInitialized = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthLoading = true;
        state.isAuth = false;
        state.errorText = '';
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isAuth = false;
        state.errorText = action.payload?.message || 'Неизвестная ошибка';
        state.isInitialized = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuth = false;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthLoading = false;
        state.isAuth = true;
        state.errorText = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorText = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.errorText = action.payload?.message || 'Неизвестная ошибка';
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthLoading = true;
        state.isAuth = false;
        state.errorText = '';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isAuth = false;
        state.errorText = action.payload?.message || 'Неизвестная ошибка';
      });
  }
});
