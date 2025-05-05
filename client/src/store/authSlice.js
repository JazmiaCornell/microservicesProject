import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Citation Scope: Implementation axios and redux for user authentication/create sessions
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=x4H3HYPx3yQ&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C&index=5
// Author: TechCheck

// Thunks for signup, signin, and submitting profile
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ username, password, first_name, last_name, email }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8080/signup", {
        username,
        password,
        first_name,
        last_name,
        email,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ username, password }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:8080/signin", {
        username,
        password,
      });
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const submitProfile = createAsyncThunk(
  "profile/submit",
  async (
    {
      user_id,
      username,
      password,
      first_name,
      last_name,
      email,
      street,
      city,
      state,
      postal_code,
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("http://localhost:8080/profile", {
        user_id,
        username,
        password,
        first_name,
        last_name,
        email,
        street,
        city,
        state,
        postal_code,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: "",
  isLoggedIn: false,
  loading: false,
  error: null,
  profile: {
    first_name: "",
    last_name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.user = "";
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.isLoggedIn = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitProfile.fulfilled, (state, action) => {
        state.user = action.meta.arg.username;
        state.isLoggedIn = true;
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(submitProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
