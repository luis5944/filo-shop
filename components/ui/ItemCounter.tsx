import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";
import { QuantityActionType } from "../../pages/product/[slug]";

interface Props {
  currentValue: number;
  updatedQuantity: (type: QuantityActionType, value?: number) => void;
}
export const ItemCounter: FC<Props> = ({ currentValue, updatedQuantity }) => {
  return (
    <Box display={"flex"} alignItems="center">
      <IconButton onClick={() => updatedQuantity("SUB", currentValue + 1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton onClick={() => updatedQuantity("SUM", currentValue + 1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
