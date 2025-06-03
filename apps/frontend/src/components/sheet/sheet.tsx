import React, { useEffect, useState } from "react";
import ExcelGrid from "../grid/grid";
import { Utils } from "../../utils";
import { initialSheetSize } from "../../CONSTANTS";
import { useParams } from "react-router-dom";
import {
  IPaginationQuerySheetRows,
  ISheetRow,
} from "../../api/types/sheets.types";
import { ISelectedArea, ISelectedCell } from "../../redux/sheetSlice.type";
import { getSheetRows } from "../../api/sheets.api";
import { useQuery } from "@tanstack/react-query";
import { cloneDeep } from "lodash";

const Sheet = () => {
  const { id } = useParams();
  const [grid, setGrid] = useState<ISheetRow[]>(
    Utils.getInitialGrid(initialSheetSize)
  );

  const [paginationParams, setPaginationParams] = useState<
    Omit<IPaginationQuerySheetRows, "sheetId">
  >({ limit: 20, page: 1 });

  const [selectedCell, setSelectedCell] = useState<ISelectedCell>(null);
  const [selectedArea, setSelectedArea] = useState<ISelectedArea>(null);

  const sheetRowsAsync = useQuery({
    queryKey: [`getSheetRows-${id}-${JSON.stringify(paginationParams)}`],
    queryFn: () => getSheetRows({ ...paginationParams, sheetId: Number(id) }),
  });

  console.log({ sheetRowsAsync, id });

  useEffect(() => {
    if (
      sheetRowsAsync.status === "success" &&
      sheetRowsAsync.data?.data?.length > 0
    ) {
      const topHeaderCells: string[] = Utils.getHeaderColCells(
        initialSheetSize.colCount
      );

      let updatedGrid: ISheetRow[] = cloneDeep(grid);
      for (const { rowIndex, rowValues, id } of sheetRowsAsync.data.data) {
        updatedGrid[rowIndex].id = id;
        updatedGrid[rowIndex].rowValues = [String(rowIndex + 1), ...rowValues];
      }

      setGrid(updatedGrid);
    }
  }, [sheetRowsAsync.status]);

  return (
    <ExcelGrid
      setGrid={setGrid}
      setSelectedArea={setSelectedArea}
      setSelectedCell={setSelectedCell}
      grid={grid}
      selectedArea={selectedArea}
      selectedCell={selectedCell}
      key={`${id}-grid`}
    />
  );
};

export default Sheet;
