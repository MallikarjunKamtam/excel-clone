import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import FormatStrikethroughOutlinedIcon from "@mui/icons-material/FormatStrikethroughOutlined";
import FormatColorTextOutlinedIcon from "@mui/icons-material/FormatColorTextOutlined";
import FormatColorFillOutlinedIcon from "@mui/icons-material/FormatColorFillOutlined";
import BorderAllOutlinedIcon from "@mui/icons-material/BorderAllOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import { useState } from "react";

type SheetHeaderProps = {
  onIconClick: (iconName: string) => void;
  selectedList: string[];
};

const iconsList: { name: string; icon: any }[] = [
  {
    icon: <FormatBoldOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "bold",
  },
  {
    icon: <FormatItalicOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "italic",
  },
  {
    icon: (
      <FormatStrikethroughOutlinedIcon color="inherit" fontSize="inherit" />
    ),
    name: "strike through",
  },
  {
    icon: <FormatColorTextOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "text color",
  },
  {
    icon: <FormatColorFillOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "fill color",
  },
  {
    icon: <BorderAllOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "borders",
  },
  {
    icon: <FormatAlignCenterOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "align center",
  },
  {
    icon: <FormatAlignLeftOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "align left",
  },
  {
    icon: <FormatAlignRightOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "align right",
  },
  {
    icon: <UndoOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "undo",
  },
  {
    icon: <RedoOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "redo",
  },
  {
    icon: <LocalPrintshopOutlinedIcon color="inherit" fontSize="inherit" />,
    name: "print",
  },
];

export const SheetHeader = ({
  onIconClick,
  selectedList,
}: SheetHeaderProps) => {
  return (
    <div className="flex items-center justify-center gap-3 bg-[#e8e8e8] p-3">
      {iconsList.map(({ icon, name }, index) => {
        return (
          <Tooltip
            key={name + index}
            title={<span className="capitalize">{name}</span>}
          >
            <IconButton
              onClick={() => {
                onIconClick(name);
              }}
              className={` ${
                selectedList.includes(name) ? "!bg-blue-200" : ""
              }`}
              size="small"
            >
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </div>
  );
};
