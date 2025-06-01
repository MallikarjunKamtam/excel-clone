import React, { useState, useEffect, useRef } from "react";
import { cell } from "../../CONSTANTS";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  setSelectedArea,
  setGrid,
  setSelectedCell,
} from "../../redux/sheet.slice";
import { cloneDeep } from "lodash";

interface ExcelCellProps {
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  isHeaderCell: boolean;
}

const ExcelCell: React.FC<ExcelCellProps> = ({
  rowIndex,
  colIndex,
  isSelected,
  isHeaderCell,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { selectedArea, grid, selectedCell } = useSelector(
    (state: RootState) => state.sheet
  );
  const dispatch = useDispatch<AppDispatch>();

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
      dispatch(
        setSelectedArea({
          colStartIndex: 0,
          colEndIndex: grid[0].length,
          rowStartIndex: 0,
          rowEndIndex: grid.length,
        })
      );
    } else if (colIndex === 0) {
      dispatch(
        setSelectedArea({
          colStartIndex: 0,
          colEndIndex: grid[0].length,
          rowStartIndex: rowIndex,
          rowEndIndex: rowIndex,
        })
      );
    } else if (rowIndex === 0) {
      dispatch(
        setSelectedArea({
          colStartIndex: colIndex,
          colEndIndex: colIndex,
          rowStartIndex: 0,
          rowEndIndex: grid.length,
        })
      );
    }

    setIsEditing(true);

    if (selectedArea) {
      dispatch(setSelectedArea(null));
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
          dispatch(setSelectedCell({ rowIndex, colIndex: colIndex - 1 }));
        }
      } else {
        if (colIndex + 1 < grid[0].length) {
          dispatch(setSelectedCell({ rowIndex, colIndex: colIndex + 1 }));
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

            dispatch(setGrid(updatedGrid));
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ width: "100%", border: "none", outline: "none" }}
        />
      ) : (
        grid[rowIndex][colIndex]
      )}
    </td>
  );
};

export default ExcelCell;
