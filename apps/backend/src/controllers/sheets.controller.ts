import { SheetService } from "@backend/services/sheets.service";
import { Request, Response } from "express";

export class SheetController {
  static async createSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetService.createSheet(req.body);
      res.status(201).json(sheet);
    } catch (err) {
      res.status(500).json({ error: "Failed to create sheet", details: err });
    }
  }

  static async getSheets(req: Request, res: Response) {
    try {
      const sheets = await SheetService.getAllSheets();
      res.json(sheets);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch sheets", details: err });
    }
  }

  static async addRow(req: Request, res: Response) {
    try {
      const row = await SheetService.addSheetRow(req.body);
      res.status(201).json(row);
    } catch (err) {
      res.status(500).json({ error: "Failed to add row", details: err });
    }
  }

  static async getSheetRows(req: Request, res: Response) {
    try {
      const sheetId = parseInt(req.params.sheetId);
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;

      const rows = await SheetService.getSheetRows(sheetId, page, limit);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch rows", details: err });
    }
  }

  static async deleteSheet(req: Request, res: Response) {
    try {
      const sheetId = parseInt(req.params.sheetId);
      await SheetService.deleteSheet(sheetId);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Failed to delete sheet", details: err });
    }
  }

  static async updateSheetRow(req: Request, res: Response) {
    try {
      const sheetId = parseInt(req.params.sheetId);
      const sheetRowId = parseInt(req.params.sheetRowId);
      const updatedData = await SheetService.updateSheetRow(
        sheetId,
        sheetRowId,
        req.body
      );
      res.status(201).json(updatedData);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to update sheet rows", details: err });
    }
  }

  static async updateCell(req: Request, res: Response) {
    try {
      const sheetId = parseInt(req.params.sheetId);
      const sheetRowId = parseInt(req.params.sheetRowId);
      const cellIndex = parseInt(req.params.cellIndex);
      const updatedData = await SheetService.updateCell(
        sheetId,
        sheetRowId,
        cellIndex,
        req.body.value
      );
      res.status(201).json(updatedData);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to update sheet cell", details: err });
    }
  }
}
