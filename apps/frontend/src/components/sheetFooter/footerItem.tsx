import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 100;

export interface IMenuOption {
  id: number;
  name: string;
}

export interface ILongMenu {
  icon?: any;
  menuOptions: IMenuOption[];
  onMenuClick: (item: IMenuOption) => void;
}

export default function LongMenu({
  icon,
  menuOptions,
  onMenuClick,
}: ILongMenu) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="text-sm">
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {icon ? icon : <MoreVertIcon fontSize="inherit" />}
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "13ch",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem
            className="!text-xs"
            key={option.id}
            onClick={() => {
              onMenuClick(option);
              handleClose();
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
