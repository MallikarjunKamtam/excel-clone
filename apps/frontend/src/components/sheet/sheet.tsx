import React, { useEffect, useRef, useState } from "react";
import ExcelGrid from "../grid/grid";
import { Utils } from "../../utils";
import { initialSheetSize } from "../../CONSTANTS";
import { useParams } from "react-router-dom";
import {
  GetSheetRowsResponse,
  IPaginationQuerySheetRows,
  ISheetRow,
} from "../../api/types/sheets.types";
import { ISelectedArea, ISelectedCell } from "../../redux/sheetSlice.type";
import { getSheetRows } from "../../api/sheets.api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SheetHeader } from "../sheetHeader/sheetHeader";
import SheetFooter from "../sheetFooter/sheetFooter";

const Sheet = () => {
  const { id } = useParams();
  const [grid, setGrid] = useState<ISheetRow[]>(
    Utils.getInitialGrid(initialSheetSize)
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const [paginationParams, setPaginationParams] = useState<
    Omit<IPaginationQuerySheetRows, "sheetId">
  >({ limit: 20, page: 1 });

  const [selectedCell, setSelectedCell] = useState<ISelectedCell>(null);
  const [selectedArea, setSelectedArea] = useState<ISelectedArea>(null);
  const [selectedHeaderList, setSelectedHeaderList] = useState<string[]>([]);
  const sheetRowsAsync: UseQueryResult<GetSheetRowsResponse, Error> = useQuery({
    queryKey: [`getSheetRows-${id}-${JSON.stringify(paginationParams)}`],
    queryFn: () => getSheetRows({ ...paginationParams, sheetId: Number(id) }),
  });

  useEffect(() => {
    if (
      sheetRowsAsync.status === "success" &&
      sheetRowsAsync.data?.data?.length > 0
    ) {
      const fetchedRows = sheetRowsAsync.data.data;
      const updatedGrid = Utils.getInitialGrid(initialSheetSize); // Fresh blank grid

      for (const { rowIndex, rowValues, id } of fetchedRows) {
        if (rowIndex < initialSheetSize.rowCount) {
          for (let col = 0; col < initialSheetSize.colCount; col++) {
            updatedGrid[rowIndex].rowValues[col] = rowValues[col] ?? "";
          }
          updatedGrid[rowIndex].id = id;
        }
      }

      setGrid(updatedGrid);
    }
  }, [sheetRowsAsync.status]);

  const handleScroll = () => {
    const el = gridRef.current;
    if (!el) return;

    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    } = el;

    if (scrollTop === 0) {
      // console.log("Reached the TOP");
    } else if (scrollTop + clientHeight + 1 >= scrollHeight) {
      const updatedGridValues: ISheetRow[] = Utils.getInitialGrid({
        colCount: grid[0].rowValues.length,
        rowCount: initialSheetSize.rowCount + grid.length,
      }).map((item, index) => {
        if (grid[index]) {
          return grid[index];
        } else return item;
      });

      setGrid(updatedGridValues);
    }

    if (scrollLeft === 0) {
      // console.log("Reached the LEFT");
    } else if (scrollLeft + clientWidth >= scrollWidth) {
      const updatedGridValues: ISheetRow[] = Utils.getInitialGrid({
        colCount: initialSheetSize.colCount + grid[0].rowValues.length,
        rowCount: grid.length,
      }).map((row, rowIndex) => {
        if (grid[rowIndex]) {
          const updatedRowValues: string[] = row.rowValues.map(
            (col, colIndex) => {
              if (grid[rowIndex][colIndex] === undefined) {
                return col;
              } else {
                return grid[rowIndex][colIndex];
              }
            }
          );

          return { ...row, rowValues: updatedRowValues };
        } else return row;
      });

      setGrid(updatedGridValues);
    }
  };

  return (
    <main className="w-full">
      <div className="sticky">
        <SheetHeader
          selectedList={selectedHeaderList}
          key={`${id}-grid`}
          onIconClick={(iconName) => {
            if (selectedHeaderList.includes(iconName)) {
              const filteredList = selectedHeaderList.filter(
                (item) => item !== iconName
              );
              setSelectedHeaderList(filteredList);
            } else {
              setSelectedHeaderList([iconName, ...selectedHeaderList]);
            }
          }}
        />
      </div>
      <div
        ref={gridRef}
        onScroll={handleScroll}
        className=" w-screen overflow-auto h-[80vh] border-2 border-[darkgray]"
      >
        <ExcelGrid
          setGrid={setGrid}
          setSelectedArea={setSelectedArea}
          setSelectedCell={setSelectedCell}
          grid={grid}
          selectedArea={selectedArea}
          selectedCell={selectedCell}
          key={`${id}-grid`}
        />
      </div>
      <div className="ml-20">
        <SheetFooter key={`Footer`} />
      </div>
    </main>
  );
};

export default Sheet;
