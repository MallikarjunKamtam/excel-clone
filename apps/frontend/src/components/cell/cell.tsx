import React, { useState, useEffect, useRef } from "react";
import { cell } from "../../CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { cloneDeep } from "lodash";
import { ISheetRow } from "../../api/types/sheets.types";
import { ISelectedArea, ISelectedCell } from "../../redux/sheetSlice.type";

interface ExcelCellProps {
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  isHeaderCell: boolean;
  selectedCell: ISelectedCell;
  selectedArea: ISelectedArea;
  grid: ISheetRow[];
  setGrid: React.Dispatch<React.SetStateAction<ISheetRow[]>>;
  setSelectedArea: React.Dispatch<React.SetStateAction<ISelectedArea>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<ISelectedCell>>;
}

const ExcelCell: React.FC<ExcelCellProps> = ({
  rowIndex,
  colIndex,
  isSelected,
  isHeaderCell,
  grid,
  selectedArea,
  selectedCell,
  setGrid,
  setSelectedArea,
  setSelectedCell,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      selectedCell &&
      selectedCell.colIndex === colIndex &&
      selectedCell.rowIndex === rowIndex
    ) {
      setIsEditing(true);
    }
  }, [selectedCell]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (rowIndex === 0 && colIndex === 0) {
      setSelectedArea({
        colStartIndex: 0,
        colEndIndex: grid[0].rowValues.length,
        rowStartIndex: 0,
        rowEndIndex: grid.length,
      });
    } else if (colIndex === 0) {
      setSelectedArea({
        colStartIndex: 0,
        colEndIndex: grid[0].rowValues.length,
        rowStartIndex: rowIndex,
        rowEndIndex: rowIndex,
      });
    } else if (rowIndex === 0) {
      setSelectedArea({
        colStartIndex: colIndex,
        colEndIndex: colIndex,
        rowStartIndex: 0,
        rowEndIndex: grid.length,
      });
    }

    setIsEditing(true);

    if (selectedArea) {
      setSelectedArea(null);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setIsEditing(false);

      if (e.shiftKey) {
        if (colIndex - 1 >= 0) {
          setSelectedCell({ rowIndex, colIndex: colIndex - 1 });
        }
      } else {
        if (colIndex + 1 < grid[0].rowValues.length) {
          setSelectedCell({ rowIndex, colIndex: colIndex + 1 });
        }
      }
    } else if (e.key === "Enter") {
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <td
      onClick={handleClick}
      className={`${isSelected ? "bg-[#cce5ff]" : ""}`}
      style={{ ...cell }}
    >
      {isEditing && !isHeaderCell ? (
        <input
          ref={inputRef}
          value={grid[rowIndex][colIndex]}
          onChange={(e) => {
            const updatedGrid = cloneDeep(grid);
            updatedGrid[rowIndex][colIndex] = e.target.value as string;

            console.log({
              updatedGrid,
              grid,
              rowIndex,
              colIndex,
            });

            setGrid(updatedGrid);
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ width: "100%", border: "none", outline: "none" }}
        />
      ) : (
        grid[rowIndex]["rowValues"][colIndex]
      )}
    </td>
  );
};

export default ExcelCell;
