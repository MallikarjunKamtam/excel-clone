import { AddSheetRowDTO, CreateSheetDTO } from "@backend/types/sheet.types";
import { SheetRow } from "@backend/models/SheetRow";
import { Sheet } from "@backend/models/Sheet";

export class SheetService {
  // Create a new sheet
  static async createSheet(data: CreateSheetDTO) {
    const { name } = data;

    const newSheet = await Sheet.create({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newSheet;
  }

  // Get all sheets
  static async getAllSheets() {
    const sheets = await Sheet.findAll();
    return sheets;
  }

  // Add a new row to a sheet
  static async addSheetRow(data: AddSheetRowDTO) {
    const { sheetId, rowIndex, rowValues } = data;

    const newRow = await SheetRow.create({
      sheetId,
      rowIndex,
      rowValues,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newRow;
  }

  // Get rows for a specific sheet with pagination
  static async getSheetRows(sheetId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const rows = await SheetRow.findAll({
      where: { sheetId },
      order: [["rowIndex", "ASC"]],
      limit,
      offset,
    });

    const totalRows = await SheetRow.count({
      where: { sheetId },
    });

    return {
      page,
      limit,
      total: totalRows,
      totalPages: Math.ceil(totalRows / limit),
      data: rows,
    };
  }

  // Delete a sheet
  static async deleteSheet(sheetId: number) {
    const deletedSheet = await Sheet.destroy({
      where: { id: sheetId },
    });

    if (deletedSheet === 0) {
      throw new Error(`Sheet with ID ${sheetId} not found.`);
    }

    return { message: "Sheet deleted successfully", sheetId };
  }

  // Update a sheet row
  static async updateSheetRow(
    sheetId: number,
    sheetRowId: number,
    data: string[]
  ) {
    const existingRow = await SheetRow.findOne({
      where: { sheetId, id: sheetRowId },
    });

    if (!existingRow) {
      throw new Error(`Sheet row with ID ${sheetRowId} not found.`);
    }

    existingRow.rowValues = data;
    existingRow.updatedAt = new Date();
    await existingRow.save();

    return existingRow;
  }

  static async updateCell(
    sheetId: number,
    sheetRowId: number,
    cellIndex: number,
    newValue: string
  ) {
    if (isNaN(sheetId) || isNaN(sheetRowId) || isNaN(cellIndex)) {
      throw new Error(`Invalid sheetId, sheetRowId, or cellIndex`);
    }

    const existingRow = await SheetRow.findOne({
      where: { sheetId, id: sheetRowId },
    });

    if (!existingRow) {
      throw new Error(`Sheet row with ID ${sheetRowId} not found.`);
    }

    // If the cell index is out of bounds but greater than 0, fill in missing cells with null values
    if (cellIndex < 0 || cellIndex >= existingRow.rowValues.length) {
      if (cellIndex > existingRow.rowValues.length) {
        // If the index is greater than the current length, extend the array with nulls
        while (existingRow.rowValues.length <= cellIndex) {
          existingRow.rowValues.push("");
        }
      }
      // Insert the new value at the specified index
      existingRow.rowValues[cellIndex] = newValue;
    } else {
      // Update the existing value at the specified index
      existingRow.rowValues[cellIndex] = newValue;
    }

    existingRow.updatedAt = new Date();

    await existingRow.save();

    return existingRow;
  }
}
