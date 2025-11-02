import createCache from "@emotion/cache";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  spacing: 4,
  direction: "ltr",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
export const cache = createCache({ key: "mui", prepend: true });
