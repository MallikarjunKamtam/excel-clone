import React, { useMemo, useState } from "react";
import ExcelCell from "../cell/cell";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { ISelectedArea, ISelectedCell } from "../../redux/sheetSlice.type";
import { ISheetRow } from "../../api/types/sheets.types";

interface IExcelGrid {
  selectedCell: ISelectedCell;
  selectedArea: ISelectedArea;
  grid: ISheetRow[];
  setGrid: React.Dispatch<React.SetStateAction<ISheetRow[]>>;
  setSelectedArea: React.Dispatch<React.SetStateAction<ISelectedArea>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<ISelectedCell>>;
}

const ExcelGrid = ({
  grid,
  selectedArea,
  selectedCell,
  setGrid,
  setSelectedArea,
  setSelectedCell,
}: IExcelGrid) => {
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.rowValues.map((val, colIndex) => {
              let isSelected: boolean = false;

              if (selectedArea) {
                if (
                  rowIndex >= selectedArea.rowStartIndex &&
                  rowIndex <= selectedArea.rowEndIndex
                ) {
                  if (
                    colIndex >= selectedArea.colStartIndex &&
                    colIndex <= selectedArea.colEndIndex
                  ) {
                    isSelected = true;
                  }
                }
              }

              return (
                <ExcelCell
                  grid={grid}
                  selectedArea={selectedArea}
                  selectedCell={selectedCell}
                  setGrid={setGrid}
                  setSelectedArea={setSelectedArea}
                  setSelectedCell={setSelectedCell}
                  isHeaderCell={rowIndex === 0 || colIndex === 0}
                  isSelected={isSelected}
                  key={colIndex + "__" + rowIndex}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExcelGrid;
