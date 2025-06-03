export interface ISheet {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISheetRow {
  id: number;
  rowIndex: number;
  rowValues: string[];
}

export interface IPaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface IPaginationQuerySheetRows {
  sheetId: number;
  page: number;
  limit: number;
}

export type GetAllSheetsResponse = ISheet[];

export type CreateSheetResponse = ISheet;

export type AddSheetRowResponse = ISheetRow;

export type GetSheetRowsResponse = IPaginatedResponse<ISheetRow>;

export interface DeleteSheetResponse {
  message: string;
  sheetId: number;
}

export interface IAddSheetRowPayload {
  sheetId: number;
  rowIndex: number;
  rowValues: string[];
}
