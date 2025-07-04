import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Citation Scope: Implementation axios and redux for user authentication/create sessions
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=x4H3HYPx3yQ&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C&index=5
// Author: TechCheck

// Thunks for signup, signin, and submitting profile
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ username, password, first_name, last_name, email }, thunkAPI) => {
    console.log("Sending to microservice-B for signup:", {
      username,
      password,
      first_name,
      last_name,
      email,
    });
    try {
      const res = await axios.post("http://localhost:8088/signup", {
        username,
        password,
        first_name,
        last_name,
        email,
      });

      const token = res.data.token;
      const decoded = jwtDecode(token);

      // store token
      localStorage.setItem("token", token);

      return {
        user_id: decoded.user_id,
        username: decoded.username,
      };

      // return res.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.error || err.message
      );
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ username, password }, thunkAPI) => {
    console.log("Sending to microservice-B for login:", {
      username,
      password,
    });
    try {
      const res = await axios.post("http://localhost:8088/signin", {
        username,
        password,
      });
      // return res.data;
      const token = res.data.token;
      const decoded = jwtDecode(token);

      localStorage.setItem("token", token);

      return {
        user_id: decoded.user_id,
        username: decoded.username,
      };
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
      const res = await axios.post("http://localhost:8088/profile", {
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

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (user_id, thunkAPI) => {
    console.log("Sending to microservice-B for account information:", {
      user_id,
    });
    try {
      const res = await axios.get(`http://localhost:8088/get-user/${user_id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: "",
  username: "",
  user_id: null,
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
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.user_id = action.payload.user_id;
      state.isLoggedIn = true;
      state.error = null;
    },
    logout: (state, action) => {
      localStorage.removeItem("token");
      state.user_id = null;
      state.username = "";
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      state.profile = initialState.profile;
    },
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          state.user_id = decoded.user_id;
          state.username = decoded.username;
          state.isLoggedIn = true;
        } catch (err) {
          console.log("Invalid token:", err);
          localStorage.removeItem("token");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.user_id = action.payload.user_id;
        state.username = action.payload.username;
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
        state.user_id = action.payload.user_id;
        state.username = action.payload.username;
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
        state.error = action.error.message;
      })
      .addCase(submitProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitProfile.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(submitProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreSession, setUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
