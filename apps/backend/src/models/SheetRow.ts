// models/SheetRow.ts
import { DataTypes, Model } from "sequelize";
import db from "../db/db"; // Assuming you have your db instance setup
import { Sheet } from "./Sheet";

export class SheetRow extends Model {
  public id!: number;
  public sheetId!: number;
  public rowIndex!: number;
  public rowValues!: string[];
  public createdAt!: Date;
  public updatedAt!: Date;
}

SheetRow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sheetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sheet",
        key: "id",
      },
    },
    rowIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rowValues: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db, // You need to pass your Sequelize instance
    modelName: "SheetRow",
    tableName: "sheet_row", // The table name in the database
    timestamps: true, // Enable timestamps for createdAt and updatedAt
  }
);

Sheet.hasMany(SheetRow, { foreignKey: "sheetId" });
SheetRow.belongsTo(Sheet, { foreignKey: "sheetId" });
