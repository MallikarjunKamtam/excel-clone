import React, { useState, useEffect, useRef, useMemo } from "react";
import { cell } from "../../CONSTANTS";
import { cloneDeep } from "lodash";
import { ISheetRow } from "../../api/types/sheets.types";
import { ISelectedArea, ISelectedCell } from "../../redux/sheetSlice.type";
import { updateSheetRowCell, addSheetRow } from "../../api/sheets.api";
import { useParams } from "react-router-dom";

interface ExcelCellProps {
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  isHeaderCell: boolean;
  grid: ISheetRow[];
  selectedCell: ISelectedCell;
  setGrid: React.Dispatch<React.SetStateAction<ISheetRow[]>>;
  setSelectedArea: React.Dispatch<React.SetStateAction<ISelectedArea>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<ISelectedCell>>;
  headerValue?: string;
  onHeaderClick?: () => void;
}

const ExcelCell: React.FC<ExcelCellProps> = ({
  rowIndex,
  colIndex,
  isSelected,
  isHeaderCell,
  grid,
  selectedCell,
  setGrid,
  setSelectedArea,
  setSelectedCell,
  headerValue,
  onHeaderClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sheetId = Number(useParams()?.id);

  useEffect(() => {
    if (
      selectedCell &&
      selectedCell.colIndex === colIndex &&
      selectedCell.rowIndex === rowIndex
    ) {
      setInputValue(grid[rowIndex].rowValues[colIndex]);
      setIsEditing(true);
    }
  }, [selectedCell]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isHeaderCell) {
      setSelectedCell(null);
      onHeaderClick?.();
      return;
    }

    setSelectedCell({ rowIndex, colIndex });
    setIsEditing(true);
    setSelectedArea(null);
  };

  const handleBlur = async () => {
    setIsEditing(false);

    const updatedGrid = cloneDeep(grid);
    updatedGrid[rowIndex].rowValues[colIndex] = inputValue;
    setGrid(updatedGrid);

    const sheetRow = grid[rowIndex];

    if (inputValue === "" && grid[rowIndex].rowValues[colIndex] === "") {
      return;
    } else {
      try {
        if (sheetRow.id === -1) {
          const res = await addSheetRow({
            sheetId,
            rowIndex,
            rowValues: updatedGrid[rowIndex].rowValues,
          });

          updatedGrid[rowIndex].id = res.id;
          setGrid(updatedGrid);
        } else {
          // Row exists, update only this cell
          await updateSheetRowCell(sheetId, sheetRow.id, colIndex, inputValue);
        }
      } catch (error) {
        console.error("Error updating/adding cell:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setIsEditing(false);

      if (e.shiftKey && colIndex > 0) {
        setSelectedCell({ rowIndex, colIndex: colIndex - 1 });
      } else if (!e.shiftKey && colIndex < grid[0].rowValues.length - 1) {
        setSelectedCell({ rowIndex, colIndex: colIndex + 1 });
      }
    } else if (["Enter", "Escape"].includes(e.key)) {
      setIsEditing(false);
    }
  };

  const isHighlightHeader: boolean = useMemo(() => {
    if (isSelected) {
      return true;
    }

    if (selectedCell) {
      if (colIndex === selectedCell.colIndex && rowIndex === -1) {
        return true;
      }
      if (rowIndex === selectedCell.rowIndex && colIndex === -1) {
        return true;
      }
    }

    return false;
  }, [isSelected, selectedCell]);

  return (
    <td
      onClick={handleClick}
      className={isHighlightHeader ? "!bg-[#cce5ff]" : ""}
      style={{ ...cell, backgroundColor: isHeaderCell ? "#eee" : "" }}
    >
      {isHeaderCell ? (
        headerValue
      ) : isEditing ? (
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ width: "100%", border: "none", outline: "none" }}
        />
      ) : (
        grid[rowIndex].rowValues[colIndex]
      )}
    </td>
  );
};

export default ExcelCell;
