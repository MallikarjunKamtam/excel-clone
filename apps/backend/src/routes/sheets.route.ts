import { SheetController } from "@backend/controllers/sheets.controller";
import { Router } from "express";

const router = Router();

router.post("/", SheetController.createSheet);
router.get("/", SheetController.getSheets);

router.post("/rows", SheetController.addRow);
router.get("/:sheetId/rows", SheetController.getSheetRows);

router.delete("/:sheetId", SheetController.deleteSheet);

export default router;
