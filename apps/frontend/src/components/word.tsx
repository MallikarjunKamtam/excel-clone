import { Tooltip } from "@mui/material";

const limit = 8;

const Word = ({ str }: { str: string }) => {
  return str?.length > limit ? (
    <Tooltip title={<span>{str}</span>}>
      <span>{str.slice(0, limit)}...</span>
    </Tooltip>
  ) : (
    <span>{str}</span>
  );
};

export default Word;
