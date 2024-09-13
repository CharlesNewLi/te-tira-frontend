import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  loading: boolean;
  error: string | null;
  token: string | null;
  email: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  token: null,
  email: null,
};

export const logIn = createAsyncThunk(
  "auth/logIn",
  async (
    paramaters: {
      email: string;
      password: string;
    },
    thunkAPI
  ) => {
    const { data } = await axios.post(`http://127.0.0.1:3000/auth/login`, {
      email: paramaters.email,
      password: paramaters.password,
    });
    return { token: data.token, email: data.email };
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.token = null;
      state.email = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: {
    [logIn.pending.type]: (state) => {
      state.loading = true;
    },
    [logIn.fulfilled.type]: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.loading = false;
      state.error = null;
    },
    [logIn.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});