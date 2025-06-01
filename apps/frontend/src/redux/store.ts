// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import sheetSliceReducer from "./sheet.slice";

export const store = configureStore({
  reducer: {
    sheet: sheetSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
