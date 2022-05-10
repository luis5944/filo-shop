import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layouts";
import { countries } from "../../utils";
import { useContext } from "react";
import { CartContext } from "../../context/cart/CartContext";

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get("firstName")?.toString() || "",
    lastName: Cookies.get("lastName")?.toString() || "",
    address: Cookies.get("address")?.toString() || "",
    address2: Cookies.get("address2")?.toString() || "",
    zip: Cookies.get("zip")?.toString() || "",
    city: Cookies.get("city")?.toString() || "",
    country: Cookies.get("country")?.toString() || "ESP",
    phone: Cookies.get("phone")?.toString() || "",
  };
};
const AddressPage = () => {
  const { updateAddress } = useContext(CartContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  const onSubmitAddress: SubmitHandler<FormData> = async (data) => {
    Cookies.set("firstName", data.firstName);
    Cookies.set("lastName", data.lastName);
    Cookies.set("address", data.address);
    Cookies.set("address2", data.address2 || "");
    Cookies.set("zip", data.zip);
    Cookies.set("city", data.city);
    Cookies.set("country", data.country);
    Cookies.set("phone", data.phone);
    updateAddress(data);
    router.replace("/checkout/summary");
  };

  return (
    <ShopLayout
      title={"Dirección"}
      pageDescription={"Confirmación de la dirección"}
    >
      <Typography variant="h1" component="h1">
        {" "}
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onSubmitAddress)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register("firstName", {
                required: "Este campo es requerido",
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "Este campo es requerido",
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              {...register("address", {
                required: "Este campo es requerido",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 (opcional)"
              variant="filled"
              fullWidth
              {...register("address2")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Código postal"
              variant="filled"
              fullWidth
              {...register("zip", {
                required: "Este campo es requerido",
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register("city", {
                required: "Este campo es requerido",
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="País"
                {...register("country", {
                  required: "Este campo es requerido",
                })}
                error={!!errors.country}
                defaultValue={countries[1].code}
              >
                {countries.map((country) => (
                  <MenuItem value={country.code} key={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register("phone", {
                required: "Este campo es requerido",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box display={"flex"} sx={{ marginTop: 5 }} justifyContent="center">
          <Button
            type="submit"
            color={"secondary"}
            className="circular-btn"
            size="large"
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

export default AddressPage;
