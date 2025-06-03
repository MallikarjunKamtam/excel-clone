import { GetAllSheetsResponse, ISheetRow } from "../api/types/sheets.types";

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

export interface SheetState {
  loadingStates: Record<string, "idle" | "pending" | "rejected" | "success">;
  allSheets: GetAllSheetsResponse;
}
