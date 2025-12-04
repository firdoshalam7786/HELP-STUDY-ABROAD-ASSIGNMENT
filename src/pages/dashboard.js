import React, { useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import useUsersStore from "../store/useUsersStore";
import useProductsStore from "../store/useProductsStore";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Chip,
} from "@mui/material";
import Link from "next/link";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsightsIcon from "@mui/icons-material/Insights";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function DashboardPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const usersTotal = useUsersStore((s) => s.total);
  const productsTotal = useProductsStore((s) => s.total);
  const usersLoading = useUsersStore((s) => s.loading);
  const productsLoading = useProductsStore((s) => s.loading);

  useEffect(() => {
    // load initial data
    useUsersStore.getState().fetchUsers();
    useProductsStore.getState().fetchProducts();
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Total Users",
        value: usersTotal,
        href: "/users",
        loading: usersLoading,
        color: "linear-gradient(135deg,#4f46e5 0%, #06b6d4 100%)",
        icon: <PeopleIcon sx={{ fontSize: 30, color: "white" }} />,
      },
      {
        title: "Total Products",
        value: productsTotal,
        href: "/products",
        loading: productsLoading,
        color: "linear-gradient(135deg,#ef4444 0%, #f97316 100%)",
        icon: <Inventory2Icon sx={{ fontSize: 30, color: "white" }} />,
      },
    ],
    [usersTotal, productsTotal, usersLoading, productsLoading]
  );

  const quickActions = useMemo(
    () => [
      { label: "View Users", href: "/users", icon: <PeopleIcon /> },
      { label: "View Products", href: "/products", icon: <Inventory2Icon /> },
      { label: "Login Page", href: "/login", icon: <VisibilityIcon /> },
      { label: "Analytics", href: "/dashboard", icon: <InsightsIcon /> },
    ],
    []
  );

  return (
    <Layout>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Snapshot of users, products, and quick actions — designed for
            clarity.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ px: 2.5, py: 0.9, fontWeight: 600 }}
            component={Link}
            href="/users/new"
          >
            Add User
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{
              px: 2,
              py: 0.9,
              borderColor: "action.disabledBackground",
            }}
          >
            Export
          </Button>

          <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
            HR
          </Avatar>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Stat cards */}
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.title}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform .18s ease, box-shadow .18s ease",
                "&:hover": { transform: "translateY(-6px)", boxShadow: 8 },
              }}
              elevation={1}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {s.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                      {s.loading ? (
                        <CircularProgress size={28} />
                      ) : (
                        s.value ?? "--"
                      )}
                    </Typography>
                  </Box>

                  {/* icon circle with gradient */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: s.color,
                      boxShadow: "rgba(0,0,0,0.12) 0px 6px 18px",
                    }}
                  >
                    {s.icon}
                  </Box>
                </Box>

                {/* subtle progress or metric -- shows relative fullness if number exists */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Activity
                    </Typography>
                    <Chip
                      label="Live"
                      size="small"
                      color="success"
                      sx={{ ml: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {/* simple computed percent for visual (defensive) */}
                      {s.value
                        ? `${Math.min(100, Math.round((s.value % 100) + 10))}%`
                        : "—"}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={s.value ? Math.min(100, (s.value % 100) + 10) : 6}
                    sx={{ mt: 1, height: 8, borderRadius: 2 }}
                  />
                </Box>

                {/* spacer to push button to bottom */}
                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Link href={s.href} style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
                      sx={{ px: 2 }}
                    >
                      Manage
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Quick actions */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Quick Actions
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1, mb: 2 }}
                color="text.secondary"
              >
                Fast access to common pages and tools.
              </Typography>

              <Box sx={{ display: "grid", gap: 1.25 }}>
                {quickActions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={a.icon}
                      sx={{
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        textTransform: "none",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Typography>{a.label}</Typography>
                      </Box>

                      <ArrowForwardIosIcon
                        sx={{ fontSize: 16, color: "action.active" }}
                      />
                    </Button>
                  </Link>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notes / Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Notes & Summary
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    This dashboard uses a Layout component with a responsive
                    drawer and logout. Below are suggested next steps:
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button variant="text" startIcon={<InsightsIcon />}>
                    View Analytics
                  </Button>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Create Report
                  </Button>
                </Stack>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isSm ? "1fr" : "1fr 1fr 1fr",
                  gap: 2,
                }}
              >
                <Box
                  sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Suggested
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Add charts and KPIs such as monthly signups, product
                    conversion, and average order value.
                  </Typography>
                </Box>

                <Box
                  sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Security
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Consider adding role-based access and audit logs for admin
                    actions.
                  </Typography>
                </Box>

                <Box
                  sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Styling
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Use consistent spacing and a limited color palette to keep
                    the UI professional.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
