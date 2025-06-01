import React, { useEffect } from "react";
import ExcelGrid from "../grid/grid";
import { ISheetResponse } from "../../../../../packages/shared/types/sheetResponse.type";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { setGrid } from "../../redux/sheet.slice";
import { Utils } from "../../utils";
import { initialSheetSize } from "../../CONSTANTS";

const Sheet = () => {
  const sheetResponse: ISheetResponse = {
    status: 200,
    data: [
      ["Name", "Age", "gender"] as string[],
      ["Raju", "13", "Male"],
      ["Pooja", "22", "Female"],
      ["Anvesh", "11", "Female"],
    ],
  };

  const { grid } = useSelector((state: RootState) => state.sheet);
  const dispatch = useDispatch<AppDispatch>();
  const topHeaderCells = Utils.getHeaderColCells(initialSheetSize.colCount);

  useEffect(() => {
    if (sheetResponse?.data?.length) {
      const updatedGrid: string[][] = grid.map((row, rowIndex: number) =>
        row.map(
          (col, colIndex: number) =>
            sheetResponse?.data?.[rowIndex]?.[colIndex] ?? col
        )
      );

      const gridWithHeaders: string[][] = [topHeaderCells, ...updatedGrid].map(
        (row, rowIndex) => {
          const leftFirstCell = rowIndex > 0 ? String(rowIndex) : "";
          return [leftFirstCell, ...row];
        }
      );

      dispatch(setGrid(gridWithHeaders));
    }
  }, [sheetResponse?.data?.length]);

  console.log(grid, "grid");

  return <ExcelGrid key={"main-grid"} />;
};

export default Sheet;
