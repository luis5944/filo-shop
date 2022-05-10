import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { AuthLayout } from "../../components/layouts";
import NextLink from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { validation } from "../../utils";
import { testloApi } from "../../api";
import { ErrorOutline } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

interface FormData {
  name: string;
  email: string;
  password: string;
}
const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onRegisterForm: SubmitHandler<FormData> = async ({
    name,
    email,
    password,
  }) => {
    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setErrorMessage(message!);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }

    // router.replace(router.query.p?.toString() || "/");
    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title={"Ingresar a la página"}>
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: "350px", padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Registro
              </Typography>

              <Chip
                sx={{
                  display: showError ? "flex" : "none",
                }}
                label={errorMessage}
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "Este campo es requerido",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={"email"}
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Este campo es requerido",
                  validate: (email) => validation.isEmail(email),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Registrar Cuenta
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p}`
                    : "/auth/login"
                }
                passHref
              >
                <Link underline="always">¿Ya tienes cuenta? Inicia sesión</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
