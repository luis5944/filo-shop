import { AuthState } from "./AuthProvider";
import { IUser } from "../../interfaces";

type authAction = { type: "login"; payload: IUser } | { type: "logout" };

export const authReducer = (state: AuthState, action: authAction) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case "logout":
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      };
    default:
      return state;
  }
};
