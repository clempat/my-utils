import React from "react";
import Routes from "./Routes";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Header />
        <Routes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
