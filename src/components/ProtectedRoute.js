import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAuthStore from "../store/useAuthStore";
import { useSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { data: session, status } = useSession();

  useEffect(() => {
    // If neither Zustand token nor next-auth session token, redirect to login
    const hasSessionToken = session?.accessToken;
    if (!token && status !== "loading" && !hasSessionToken) {
      router.replace("/login");
    } else {
      // If session exists but Zustand doesn't have token, sync it
      if (!token && hasSessionToken) {
        useAuthStore
          .getState()
          .setAuth({ token: session.accessToken, user: session.user });
      }
    }
  }, [token, session, status, router]);

  // Show loader while session is loading or token is initializing
  if (!token && status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
