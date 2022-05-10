import Cookies from "js-cookie";
import React, { FC, useEffect, useReducer } from "react";
import { testloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import axios from "axios";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}
const INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};
const AuthProvider: FC = ({ children }) => {
  const { data, status } = useSession();
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "login", payload: data?.user as IUser });
    }
  }, [status, data]);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await testloApi.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{
    hasError: boolean;
    message?: string;
  }> => {
    try {
      const { data } = await testloApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "login", payload: user });

      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "No se pudo crear el usuario",
      };
    }
  };

  const logoutUser = () => {
    Cookies.remove("cart");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("zip");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("phone");

    signOut();
  };
  return (
    <AuthContext.Provider
      value={{ ...state, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
