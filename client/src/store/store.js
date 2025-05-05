import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";

// Citation Scope: Implementation redux for user authentication/create sessions
// Date: 05/04/2025
// Originality: Adapted
// Source: https://www.youtube.com/watch?v=x4H3HYPx3yQ&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C&index=5
// Author: TechCheck

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
