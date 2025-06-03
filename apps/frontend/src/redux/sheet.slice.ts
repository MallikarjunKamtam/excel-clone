import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllSheets } from "../api/sheets.api";
import { SheetState } from "./sheetSlice.type";

const initialState: SheetState = {
  loadingStates: {
    getAllSheets: "idle",
    addSheet: "idle",
    addSheetRow: "idle",
    deleteSheet: "idle",
    getSheetRows: "idle",
    updateSheetRow: "idle",
    updateSheetRowCell: "idle",
  },
  allSheets: [],
};

export const getAllSheetsAsync = createAsyncThunk("getAllSheets", async () => {
  const result = await getAllSheets();
  return result;
});

const sheetSlice = createSlice({
  name: "sheetSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSheetsAsync.pending, (state) => {
        state.loadingStates["getAllSheets"] = "pending";
      })
      .addCase(getAllSheetsAsync.fulfilled, (state, action) => {
        state.loadingStates["getAllSheets"] = "success";
        state.allSheets = action.payload;
      })
      .addCase(getAllSheetsAsync.rejected, (state, action) => {
        state.loadingStates["getAllSheets"] = "rejected";
      });
  },
});

export const {} = sheetSlice.actions;
export default sheetSlice.reducer;
