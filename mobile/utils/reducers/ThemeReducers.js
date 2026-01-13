import { Colors } from "../ColorsUtils";

export const initialThemeState = {
  mode: "light",
  colors: Colors.light,
};

export const ThemeReducer = (state, action) => {
  switch (action.type) {
    case "light":
      return { mode: "light", colors: Colors.light };
    case "dark":
      return { mode: "dark", colors: Colors.dark };
    default:
      return state;
  }
};