import React, { FC, useReducer } from "react";
import { uiContext } from "./UiContext";
import { uiReducer } from "./uiReducer";

export interface UiState {
  isMenuOpen: boolean;
}

const initialState: UiState = {
  isMenuOpen: false,
};

export const UiProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const openCloseMenu = () => {
    dispatch({ type: "OPEN_CLOSE_MENU" });
  };
  return (
    <uiContext.Provider value={{ ...state, openCloseMenu }}>
      {children}
    </uiContext.Provider>
  );
};
