import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./features/auth/authSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "./storage";
import { baseApi } from "./api/baseApi";

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistOptions = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"],

  // Add these for better performance in Next.js 16
  timeout: 1000, // Reduce timeout
  serialize: true,
  writeFailHandler: (err: Error) => {
    console.log("Redux Persist Write Error:", err);
  },
};

const persistedReducer = persistReducer(persistOptions, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],

          ignoredPaths: ["api"],
        },
        immutableCheck: {
          warnAfter: 128,
        },
      }).concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
