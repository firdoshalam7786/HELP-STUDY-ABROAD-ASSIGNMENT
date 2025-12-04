// src/pages/_app.js
import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import useAuthStore from "../store/useAuthStore";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Optional: simple MUI theme (you can replace/extend)
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // restore token & user from localStorage (if present)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const store = useAuthStore.getState();

    // prefer loadAuthFromStorage, fallback to initFromStorage if present
    if (typeof store.loadAuthFromStorage === "function") {
      store.loadAuthFromStorage();
    } else if (typeof store.initFromStorage === "function") {
      store.initFromStorage();
    }
    // no dependencies: run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
