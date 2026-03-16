import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuth: boolean;
  isAuthLoading: boolean;
  errorText: string;
}

interface LoginError {
  success: boolean;
  message: string;
}

const initialState = {
  user: null,
  isAuth: false,
  isAuthLoading: false,
  errorText: ''
} satisfies UserState as UserState;

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: LoginError }
>('user/loginUser', async (loginData: TLoginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch (error) {
    const err = error as LoginError;
    return rejectWithValue(err);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: LoginError }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    const err = error as LoginError;
    return rejectWithValue(err);
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: LoginError }
>(
  'user/registerUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(registerData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      const err = error as LoginError;
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: LoginError }
>(
  'user/updateUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(registerData);
      return response.user;
    } catch (error) {
      const err = error as LoginError;
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
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.isAuthLoading = false;
        state.errorText = '';
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthLoading = true;
        state.isAuth = false;
        state.errorText = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.isAuth = false;
        state.errorText = action.payload?.message || 'Неизвестная ошибка';
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
