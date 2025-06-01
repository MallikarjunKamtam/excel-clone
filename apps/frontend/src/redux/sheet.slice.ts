import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialSheetSize } from "../CONSTANTS";
import { Utils } from "../utils";

export interface ISelectedArea {
  colStartIndex: number;
  colEndIndex: number;
  rowStartIndex: number;
  rowEndIndex: number;
}

export interface ISelectedCell {
  rowIndex: number;
  colIndex: number;
}

interface SheetState {
  selectedArea: ISelectedArea | null;
  grid: string[][];
  selectedCell: ISelectedCell | null;
}

const initialState: SheetState = {
  selectedArea: null,
  grid: Utils.getInitialGrid(initialSheetSize),
  selectedCell: null,
};

const sheetSlice = createSlice({
  name: "sheetSlice",
  initialState,
  reducers: {
    setGrid(state, action: PayloadAction<string[][]>) {
      state.grid = action.payload;
    },
    setSelectedArea(state, action: PayloadAction<ISelectedArea | null>) {
      state.selectedArea = action.payload;
    },
    setSelectedCell(state, action: PayloadAction<ISelectedCell | null>) {
      state.selectedCell = action.payload;
    },
  },
});

export const { setSelectedArea, setGrid, setSelectedCell } = sheetSlice.actions;
export default sheetSlice.reducer;
