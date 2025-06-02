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
       WHERE "sheetId" = $1
       ORDER BY "rowIndex" ASC
       LIMIT $2 OFFSET $3`,
      {
        replacements: [sheetId, limit, offset],
        type: QueryTypes.SELECT,
      }
    );

    // Get total count of rows
    const countResult: any = await db.query(
      `SELECT COUNT(*) AS total
       FROM public.sheet_row
       WHERE "sheetId" = $1`,
      {
        replacements: [sheetId],
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
}
