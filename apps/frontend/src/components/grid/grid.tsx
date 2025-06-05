import React from "react";
import ExcelCell from "../cell/cell";
import { ISheetRow } from "../../api/types/sheets.types";
import { ISelectedArea, ISelectedCell } from "../../redux/sheetSlice.type";
import { Utils } from "../../utils";

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
  const colHeaders = Utils.getHeaderColCells(grid[0]?.rowValues.length || 0);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr className="">
          <td
            onClick={() => {
              if (selectedArea) {
                setSelectedArea(null);
              } else {
                setSelectedArea({
                  colStartIndex: 0,
                  colEndIndex: grid[0]?.rowValues.length,
                  rowStartIndex: 0,
                  rowEndIndex: grid.length - 1,
                });
              }
            }}
            style={{ width: 30, backgroundColor: "#eee" }}
          ></td>
          {colHeaders.map((header, colIndex) => (
            <ExcelCell
              key={`header-${colIndex}`}
              rowIndex={-1}
              colIndex={colIndex}
              isSelected={false}
              isHeaderCell={true}
              headerValue={header}
              grid={grid}
              selectedCell={selectedCell}
              setGrid={setGrid}
              setSelectedArea={setSelectedArea}
              setSelectedCell={setSelectedCell}
              onHeaderClick={() => {
                if (selectedArea) {
                  setSelectedArea(null);
                } else {
                  setSelectedArea({
                    colStartIndex: colIndex,
                    colEndIndex: colIndex,
                    rowStartIndex: 0,
                    rowEndIndex: grid.length - 1,
                  });
                }
              }}
            />
          ))}
        </tr>

        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <ExcelCell
              rowIndex={rowIndex}
              colIndex={-1}
              isSelected={false}
              isHeaderCell={true}
              headerValue={String(rowIndex + 1)}
              grid={grid}
              selectedCell={selectedCell}
              setGrid={setGrid}
              setSelectedArea={setSelectedArea}
              setSelectedCell={setSelectedCell}
              onHeaderClick={() => {
                if (selectedArea) {
                  setSelectedArea(null);
                } else {
                  setSelectedArea({
                    colStartIndex: 0,
                    colEndIndex: grid[0].rowValues.length - 1,
                    rowStartIndex: rowIndex,
                    rowEndIndex: rowIndex,
                  });
                }
              }}
            />

            {row.rowValues.map((_, colIndex) => {
              const isSelected = selectedArea
                ? rowIndex >= selectedArea.rowStartIndex &&
                  rowIndex <= selectedArea.rowEndIndex &&
                  colIndex >= selectedArea.colStartIndex &&
                  colIndex <= selectedArea.colEndIndex
                : false;

              return (
                <ExcelCell
                  key={`${rowIndex}-${colIndex}`}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  isSelected={isSelected}
                  isHeaderCell={false}
                  grid={grid}
                  selectedCell={selectedCell}
                  setGrid={setGrid}
                  setSelectedArea={setSelectedArea}
                  setSelectedCell={setSelectedCell}
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
