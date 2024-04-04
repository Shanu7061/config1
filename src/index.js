import "@fontsource/roboto/400.css";
import { createTheme, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";
import store from "./Store";

const container = document.getElementById("root");
const root = createRoot(container);

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const DarkModeTheme = () => {
  const [mode, setMode] = React.useState(
    sessionStorage.getItem("darkMode") === "dark" ? "dark" : "light"
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          sessionStorage.setItem(
            "darkMode",
            prevMode === "light" ? "dark" : "light"
          );
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    []
  );

  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#9b51e0",
            },
            green: { main: " #39C16C", light: "#ebfde7" },
            blue: { main: "#4ABCEC" },
            nav: {
              main: "rgb(104 103 103 / 19%)",
              secondary: "rgb(104 103 103 / 11%)",
            },
            yellow: { main: "#F9B417" },
            purple: { main: "#662D91" },
            turquoise: { main: "#42C1C7", light: "#fff2f2" },
            red: { main: "#EE3263" },
            secondary: {
              main: "#484D56",
              extralight: "rgb(211,211,211,0.8)",
            },
            buttonDefault: {
              main: "#FFFFFF",
            },
          }
        : {
            primary: {
              main: "#9b51e0",
            },
            green: { main: " #39C16C", light: "rgba(255, 255, 255, 0.08);" },
            blue: { main: "#4ABCEC" },
            nav: { main: "#414141", secondary: "#202020" },
            yellow: { main: "#F9B417" },
            purple: { main: "#662D91" },
            turquoise: { main: "#42C1C7", light: "#000000" },
            red: { main: "#EE3263" },
            secondary: {
              main: "#c9d1d9",
              extralight: "rgb(211,211,211,0.8)",
            },
            buttonDefault: {
              main: "#FFFFFF",
            },
          }),
    },
    typography: {
      fontSize: 12,
      fontFamily: ["Roboto"],
    },
  });

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            body: {
              backgroundColor:
                theme.palette.mode == "light" ? "#f2f5f8" : "#121212",
            },
          }}
        />
        <Provider store={store}>
          <App colorMode={colorMode} />
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

root.render(
  <Router>
    <DarkModeTheme />
  </Router>
);
