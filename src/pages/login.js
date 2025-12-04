import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { signIn } from "next-auth/react";
import useAuthStore from "../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in → redirect to dashboard
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Call our proxy-login route instead of DummyJSON
      const resp = await axios.post("/api/auth/proxy-login", {
        username: data.username,
        password: data.password,
      });

      const payload = resp.data?.data;

      if (!payload?.token) {
        setError("Login failed: No token received");
        setLoading(false);
        return;
      }

      // 2️⃣ Save token & user in Zustand store
      setAuth({
        token: payload.token,
        user: {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
      });

      // 3️⃣ Tell NextAuth to create session using token-mode
      await signIn("credentials", {
        redirect: false,
        username: payload.username,
        token: payload.token,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        id: payload.id,
      });

      router.replace("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Login failed. Check username/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "70vh" }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        xs={11}
        sm={8}
        md={4}
        component={Paper}
        elevation={6}
        square
        sx={{ p: 3 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Admin Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...register("username", { required: true })}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register("password", { required: true })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Login"}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
