import React from "react";
import { ThemeProvider } from "@chakra-ui/core";
import Routes from "./Routes";

function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
