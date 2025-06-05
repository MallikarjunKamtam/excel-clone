import {
  getAllSheets,
  addSheet,
  deleteSheet,
  renameSheet,
} from "../../api/sheets.api";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetAllSheetsResponse } from "../../api/types/sheets.types";
import LongMenu from "./footerItem";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Word from "../word";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";

const SheetFooter = () => {
  const navigate = useNavigate();
  const currentSheetId = useParams()?.id;
  const [focussedSheetId, setFocussedSheetId] = useState<number>(null);
  const [updatedSheetName, setUpdatedSheetName] = useState<string>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const getAllSheetsAsync: UseQueryResult<GetAllSheetsResponse, Error> =
    useQuery({
      queryFn: getAllSheets,
      queryKey: ["getAllSheets"],
    });

  const addSheetAsync = useMutation({
    mutationKey: ["addSheet"],
    mutationFn: (name: string) => addSheet(name),
    onSuccess: () => {
      getAllSheetsAsync.refetch();
    },
    onError(error, variables, context) {
      toast("Failed to add sheet.", { type: "error" });
    },
  });

  const deleteSheetAsync = useMutation({
    mutationKey: ["deleteSheet"],
    mutationFn: (id: number) => deleteSheet(id),
    onSuccess: () => {
      getAllSheetsAsync.refetch();
    },
    onError: (event) => {
      toast("Failed to delete.", { type: "error" });
    },
  });

  const navigateToSheet = (id: number) => {
    if (Number(currentSheetId) !== Number(id)) {
      navigate(`/sheet/${id}`);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focussedSheetId]);

  return (
    <div className="flex items-center justify-start gap-1 w-full">
      <AddIcon
        className="cursor-pointer"
        onClick={async () => {
          await addSheetAsync.mutateAsync(
            `Sheet ${(getAllSheetsAsync?.data?.length ?? 0) + 1}`
          );
        }}
      />
      <LongMenu
        icon={<MenuIcon />}
        onMenuClick={(item) => navigateToSheet(item.id)}
        menuOptions={getAllSheetsAsync?.data ?? []}
      />
      <div className="flex items-center justify-start gap-0.5 w-full overflow-scroll max-w-[94%]">
        {(getAllSheetsAsync.data ?? []).map(({ id, name }, index) => {
          return focussedSheetId === id ? (
            <input
              className="min-w-[120px] text-xs h-[30px]"
              onChange={(event) => {
                setUpdatedSheetName(event.target.value);
              }}
              ref={inputRef}
              value={updatedSheetName}
              onBlur={async () => {
                if (name !== updatedSheetName) {
                  await renameSheet({ name: updatedSheetName, sheetId: id });
                }

                setFocussedSheetId(null);
              }}
            />
          ) : (
            <span
              onDoubleClick={() => {
                setUpdatedSheetName(name);
                setFocussedSheetId(id);
              }}
              onClick={() => navigateToSheet(id)}
              className="pl-3 border min-w-[120px] w-full cursor-pointer rounded-sm border-black px-1 py-[0.5px] text-xs flex items-center  justify-between"
            >
              <Word str={name} />
              <span onClick={(e) => e.stopPropagation()}>
                <LongMenu
                  menuOptions={[
                    { id: 1, name: "Rename" },
                    { id: 2, name: "Delete" },
                  ]}
                  onMenuClick={async (item) => {
                    if (item.name === "Delete") {
                      await deleteSheetAsync.mutateAsync(item.id);
                    }
                  }}
                />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SheetFooter;
