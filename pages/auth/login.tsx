import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AuthLayout } from "../../components/layouts";
import NextLink from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { validation } from "../../utils";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getProviders, getSession, signIn } from "next-auth/react";
import GitHubIcon from "@mui/icons-material/GitHub";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders()
      .then((prov) => setProviders(prov))
      .catch((err) => {
        console.log("error aqui");
      });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onLoginUser: SubmitHandler<FormData> = async ({ email, password }) => {
    setShowError(false);

    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title={"Ingresar a la página"}>
      <form onSubmit={handleSubmit(onLoginUser)}>
        <Box sx={{ width: "350px", padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>

              <Chip
                sx={{
                  display: showError ? "flex" : "none",
                }}
                label="No existe ese usuario/contraseña"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
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
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="center">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p}`
                    : "/auth/register"
                }
                passHref
              >
                <Link underline="always">¿No tienes cuenta? Registrate</Link>
              </NextLink>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              flexDirection={"column"}
              justifyContent={"center"}
            >
              <Divider sx={{ width: "100%", mb: 2 }} />

              {Object.values(providers).map((provider: any) => {
                return (
                  provider.id !== "credentials" && (
                    <Button
                      key={provider.id}
                      variant="outlined"
                      fullWidth
                      color="primary"
                      sx={{
                        mb: 1,
                      }}
                      startIcon={<GitHubIcon />}
                      onClick={() => signIn(provider.id)}
                    >
                      {provider.name}
                    </Button>
                  )
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  console.log(session);
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
export default LoginPage;
