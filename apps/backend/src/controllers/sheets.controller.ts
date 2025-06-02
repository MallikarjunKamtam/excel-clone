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
      const rows = await SheetService.getSheetRows(sheetId);
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
}
