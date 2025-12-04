import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  SvgIcon,
} from "@mui/material";

function LogoIcon(props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2z" />
      <path d="M12 7.5l6 3.5v6.5L12 19l-6-1.5V11L12 7.5z" fill="white" />
    </SvgIcon>
  );
}

export default function HomePage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  // heights to match layout and avoid scroll
  const HEADER_HEIGHT = 72;
  const FOOTER_HEIGHT = 72;
  const HERO_HEIGHT = `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflowX: "hidden", // avoid horizontal scroll
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top nav (fixed height) */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: { xs: 2, md: 4 },
          flexShrink: 0,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 0,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar sx={{ width: 44, height: 44, bgcolor: "primary.main" }}>
              <LogoIcon sx={{ fontSize: 26 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              HelpStudyAbroad
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button variant="text" size="small">
                Login
              </Button>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small">
                Dashboard
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* HERO — sized to exact available viewport space */}
      <Box
        component="section"
        sx={{
          width: "100%",
          height: HERO_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            display: "flex",
            gap: 6,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            py: { xs: 2, md: 0 },
          }}
        >
          {/* Left copy */}
          <Box sx={{ maxWidth: 720 }}>
            <Typography
              variant={isSm ? "h4" : "h2"}
              sx={{
                fontWeight: 800,
                lineHeight: 1.03,
                mb: 2,
                background:
                  "linear-gradient(90deg, #6366F1 0%, #3B82F6 30%, #06B6D4 60%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Frontend assessment for modern admin interfaces
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 680, mb: 3 }}
            >
              A compact demo of authentication, protected routes, user & product
              management, pagination, filters and a responsive MUI-based
              interface built for clarity and maintainability.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 3.5,
                    py: 1.15,
                    fontWeight: 700,
                    backgroundColor: "primary.main",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  View Dashboard
                </Button>
              </Link>

              <Link href="/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ px: 3, py: 1.15 }}
                >
                  Go to Login
                </Button>
              </Link>
            </Box>

            <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>
              <Feature label="Secure auth" />
              <Feature label="Clean MUI UI" />
              <Feature label="Fast to extend" />
            </Box>
          </Box>

          {/* Right card — constrained height to avoid overflow */}
          <Box sx={{ width: { xs: "100%", md: 420 }, flexShrink: 0 }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                p: 3,
                height: isSm ? "auto" : Math.max(260, "100%"),
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Overview
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        background:
                          "linear-gradient(90deg, #6366F1 0%, #3B82F6 40%, #06B6D4 75%, #10B981 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Admin Snapshot
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      Updated
                    </Typography>
                    <Typography variant="subtitle2">Today</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1}>
                  <Stat label="Users" value="1,240" />
                  <Stat label="Products" value="324" />
                  <Stat label="Pages" value="18" />
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  Ready for HR demos — minimal, accessible, and easy to explain.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/users" style={{ textDecoration: "none" }}>
                  <Button variant="text" size="small">
                    View users
                  </Button>
                </Link>
                <Link href="/products" style={{ textDecoration: "none" }}>
                  <Button variant="contained" size="small">
                    Products
                  </Button>
                </Link>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Secondary content — kept compact to avoid pushing beyond viewport */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          flexShrink: 0,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MiniCard
              title="Designed for interviews"
              body="Clear, focused screens that you can demo and explain in interviews."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiniCard
              title="Extendable"
              body="Zustand + MUI architecture lets you add features quickly."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiniCard
              title="Production-ready look"
              body="Conservative typography, spacing and colors suitable for enterprise."
            />
          </Grid>
        </Grid>
      </Box>

      {/* Footer with fixed height */}
      <Box
        component="footer"
        sx={{
          height: FOOTER_HEIGHT,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          px: { xs: 2, md: 4 },
          mt: "auto",
          flexShrink: 0,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ display: "flex", justifyContent: "space-between", px: 0 }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} HelpStudyAbroad — Frontend assessment
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Typography variant="caption" color="text.secondary">
                Privacy
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: "none" }}>
              <Typography variant="caption" color="text.secondary">
                Terms
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

/* helpers */
function Feature({ label = "" }) {
  return (
    <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
      <Box
        sx={{ width: 8, height: 8, borderRadius: 1.5, bgcolor: "primary.main" }}
      />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function Stat({ label, value }) {
  return (
    <Grid item xs={4}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Grid>
  );
}

function MiniCard({ title, body }) {
  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {body}
      </Typography>
    </Paper>
  );
}
