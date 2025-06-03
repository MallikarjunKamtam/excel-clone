import { AddSheetRowDTO, CreateSheetDTO } from "@backend/types/sheet.types.ts";
import db from "@backend/db/db";
import { QueryTypes } from "sequelize";

export class SheetService {
  static async createSheet(data: CreateSheetDTO) {
    const { name } = data;

    const result: any[] = await db.query(
      `INSERT INTO public.sheet ("name", "createdAt", "updatedAt")
       VALUES ($1, NOW(), NOW())
       RETURNING *`,
      {
        replacements: [name],
        type: QueryTypes.INSERT,
      }
    );

    return result[0][0];
  }

  static async getAllSheets() {
    const result = await db.query(`SELECT * FROM public.sheet`, {
      type: QueryTypes.SELECT,
    });

    return result;
  }

  static async addSheetRow(data: AddSheetRowDTO) {
    const { sheetId, rowIndex, rowValues } = data;

    const result: any[] = await db.query(
      `INSERT INTO public.sheet_row ("sheetId", "rowIndex", "rowValues", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      {
        replacements: [sheetId, rowIndex, rowValues],
        type: QueryTypes.INSERT,
      }
    );

    return result[0][0];
  }

  static async getSheetRows(sheetId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    // Get paginated rows
    const rows = await db.query(
      `SELECT id, "rowIndex", "rowValues"
     FROM public.sheet_row
     WHERE "sheetId" = :sheetId
     ORDER BY "rowIndex" ASC
     LIMIT :limit OFFSET :offset`,
      {
        replacements: { sheetId, limit, offset },
        type: QueryTypes.SELECT,
      }
    );

    // Get total count of rows
    const countResult: any = await db.query(
      `SELECT COUNT(*) AS total
     FROM public.sheet_row
     WHERE "sheetId" = :sheetId`,
      {
        replacements: { sheetId },
        type: QueryTypes.SELECT,
      }
    );

    const total = parseInt(countResult[0].total, 10);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: rows,
    };
  }

  static async deleteSheet(sheetId: number) {
    await db.query(`DELETE FROM public.sheet WHERE id = $1`, {
      replacements: [sheetId],
      type: QueryTypes.DELETE,
    });

    return { message: "Sheet deleted successfully", sheetId };
  }

  static async updateSheetRow(
    sheetId: number,
    sheetRowId: number,
    data: string[]
  ) {
    const [existingRow]: any = await db.query(
      `SELECT * FROM public.sheet_row
     WHERE "sheetId" = $1 AND id = $2`,
      {
        replacements: [sheetId, sheetRowId],
        type: QueryTypes.SELECT,
      }
    );

    if (!existingRow) {
      throw new Error(`Sheet row with ID ${sheetRowId} not found.`);
    }

    // Update the row values
    const [updatedRow]: any = await db.query(
      `UPDATE public.sheet_row
     SET "rowValues" = $1, "updatedAt" = NOW()
     WHERE "sheetId" = $2 AND id = $3
     RETURNING *`,
      {
        replacements: [data, sheetId, sheetRowId],
        type: QueryTypes.UPDATE,
      }
    );

    return updatedRow[0];
  }

  static async updateCell(
    sheetId: number,
    sheetRowId: number,
    cellIndex: number,
    newValue: string
  ) {
    // Step 1: Get the existing row
    const [existingRow]: any = await db.query(
      `SELECT * FROM public.sheet_row
       WHERE "sheetId" = $1 AND id = $2`,
      {
        replacements: [sheetId, sheetRowId],
        type: QueryTypes.SELECT,
      }
    );

    // Step 2: Check if the row exists
    if (!existingRow) {
      throw new Error(`Sheet row with ID ${sheetRowId} not found.`);
    }

    // Step 3: Check if the cell index is within bounds
    const rowValues = existingRow.rowValues; // This should be an array of strings
    if (cellIndex < 0 || cellIndex >= rowValues.length) {
      throw new Error(`Cell index ${cellIndex} out of bounds.`);
    }

    // Step 4: Update the specific cell
    rowValues[cellIndex] = newValue;

    // Step 5: Update the row in the database
    const [updatedRow]: any = await db.query(
      `UPDATE public.sheet_row
       SET "rowValues" = $1, "updatedAt" = NOW()
       WHERE "sheetId" = $2 AND id = $3
       RETURNING *`,
      {
        replacements: [rowValues, sheetId, sheetRowId],
        type: QueryTypes.UPDATE,
      }
    );

    // Step 6: Return the updated row
    return updatedRow[0];
  }
}
