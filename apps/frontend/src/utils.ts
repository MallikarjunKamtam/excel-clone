import { ISheetRow } from "./api/types/sheets.types";

export class Utils {
  public static getInitialGrid({
    colCount,
    rowCount,
  }: {
    rowCount: number;
    colCount: number;
  }): ISheetRow[] {
    const result: ISheetRow[] = Array(rowCount)
      .fill("")
      .map(
        (_, index) =>
          ({
            id: null,
            rowIndex: index,
            rowValues: Array(colCount).fill(""),
          } as ISheetRow)
      );

    return result;
  }

  public static getHeaderColCells(count: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
      let col = "";
      let n = i;

      while (n >= 0) {
        col = String.fromCharCode((n % 26) + 65) + col;
        n = Math.floor(n / 26) - 1;
      }

      result.push(col);
    }

    return result;
  }

  public static getHeaderRowCells(count: number): string[] {
    return Array(count)
      .fill("")
      .map((_, index) => String(index + 1));
  }
}
