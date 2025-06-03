import axios from "axios";
import {
  AddSheetRowResponse,
  CreateSheetResponse,
  DeleteSheetResponse,
  GetAllSheetsResponse,
  IAddSheetRowPayload,
  IPaginationQuerySheetRows,
} from "./types/sheets.types";
import { GetSheetRowsResponse } from "./types/sheets.types";

const baseUrl = process.env.REACT_APP_BACKEND_SERVICE_BASE_URL;

export const getAllSheets = async (): Promise<GetAllSheetsResponse> => {
  const response = await axios.get(`${baseUrl}/sheets`);
  return response.data;
};

export const getSheetRows = async (
  query: IPaginationQuerySheetRows
): Promise<GetSheetRowsResponse> => {
  const { sheetId, ...params } = query;
  console.log(baseUrl);
  const response = await axios.get(`${baseUrl}/sheets/${sheetId}/rows`, {
    params,
  });
  return response.data;
};

export const addSheet = async (name: string): Promise<CreateSheetResponse> => {
  const response = await axios.post(`${baseUrl}/sheets`, { data: { name } });

  return response.data;
};

export const addSheetRow = async (
  data: IAddSheetRowPayload
): Promise<AddSheetRowResponse> => {
  const response = await axios.post(`${baseUrl}/sheets/rows`, { data });

  return response.data;
};

export const deleteSheet = async (
  sheetId: number
): Promise<DeleteSheetResponse> => {
  const response = await axios.delete(`${baseUrl}/sheets/${sheetId}`);

  return response.data;
};

export const updateSheetRow = async (
  sheetId: number,
  sheetRowId: number,
  data: string[]
) => {
  const response = await axios.put(
    `${baseUrl}/sheets/${sheetId}/${sheetRowId}`,
    { data }
  );

  return response.data;
};

export const updateSheetRowCell = async (
  sheetId: number,
  sheetRowId: number,
  cellIndex: number,
  cellValue: string
) => {
  const response = await axios.put(
    `${baseUrl}/sheets/${sheetId}/${sheetRowId}/${cellIndex}`,
    { data: { value: cellValue } }
  );

  return response.data;
};
