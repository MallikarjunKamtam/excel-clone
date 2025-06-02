export interface CreateSheetDTO {
  name: string;
}

export interface AddSheetRowDTO {
  sheetId: number;
  rowIndex: number;
  rowValues: string[];
}
