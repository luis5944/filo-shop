import { UiState } from "./UiProvider";

type UiAction = { type: "OPEN_CLOSE_MENU" };

export const uiReducer = (state: UiState, action: UiAction) => {
  switch (action.type) {
    case "OPEN_CLOSE_MENU":
      return { ...state, isMenuOpen: !state.isMenuOpen };
    default:
      return state;
  }
};
