import { Box, Button } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import { ICartProduct, ISize } from "../../interfaces";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onSelectedSize: (size: ISize) => void;
}
export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSelectedSize,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
          onClick={() => onSelectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
