import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import React, { FC, useMemo } from "react";
import { IProduct } from "../../interfaces";
import NextLink from "next/link";
import { useState } from "react";
import { format } from "../../utils";

interface Props {
  product: IProduct;
}
export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);
  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              {product.inStock > 0 ? null : (
                <Chip
                  color="error"
                  label="Sin Stock"
                  sx={{
                    position: "absolute",
                    zIndex: "99",
                    top: "10px",
                    left: "10px",
                    height: "15px",
                  }}
                />
              )}
              <CardMedia
                className="fadeIn"
                component="img"
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box
        sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }}
        className={"fadeIn"}
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`${format(product.price)}`}</Typography>
      </Box>
    </Grid>
  );
};
