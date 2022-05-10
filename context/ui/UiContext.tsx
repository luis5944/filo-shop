import { createContext } from "react";

export interface ContextProps {
  isMenuOpen: boolean;
  openCloseMenu: () => void;
}
export const uiContext = createContext({} as ContextProps);
