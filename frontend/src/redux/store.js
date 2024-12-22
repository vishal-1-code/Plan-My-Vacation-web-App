import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web

// Combine all reducers
const rootReducer = combineReducers({ 
  user: userReducer 
});

// Persist configuration
const persistConfig = {
  key: "root", // Key for storage in localStorage
  storage,     // Storage type (localStorage)
  version: 1,  // Versioning for persistence
  whitelist: ["user"], // Specify which slices to persist (e.g., 'user' slice only)
};

// Create a persisted reducer using persistConfig and rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for Redux-Persist
    }),
});

// Create a persistor to manage persistence
export const persistor = persistStore(store);

// Utility function to clear persisted data during logout
export const clearPersistedData = () => {
  persistor.purge(); // Clears all persisted data
};
