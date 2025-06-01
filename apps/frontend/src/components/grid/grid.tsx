import React, { useMemo, useState } from "react";
import ExcelCell from "../cell/cell";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";

interface IExcelGrid {}

const ExcelGrid = ({}: IExcelGrid) => {
  const { grid, selectedArea } = useSelector((state: RootState) => state.sheet);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((val, colIndex) => {
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
