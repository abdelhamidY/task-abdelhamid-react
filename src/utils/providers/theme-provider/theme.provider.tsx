import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as ReactThemeProvider } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

import theme, { cache } from "../../theme";

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <CacheProvider value={cache}>
      <ReactThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ReactThemeProvider>
    </CacheProvider>
  );
};

export default ThemeProvider;
