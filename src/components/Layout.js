// src/components/Layout.js
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Container,
  Divider,
  useMediaQuery,
  InputBase,
  Tooltip,
  Menu,
  MenuItem,
  CssBaseline,
  Paper,
  Badge,
  Stack,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import useAuthStore from "../store/useAuthStore";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
  { label: "Users", href: "/users", icon: <PeopleIcon /> },
  { label: "Products", href: "/products", icon: <Inventory2Icon /> },
];

const drawerWidth = 260;

export default function Layout({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const userInitial = useMemo(() => {
    if (!user) return "U";
    if (user.firstName) return user.firstName[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    return "U";
  }, [user]);

  // profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfile = Boolean(anchorEl);
  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    logout();
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  // small search state (local only)
  const [search, setSearch] = useState("");

  // Drawer content (stylish)
  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "transparent" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Paper elevation={0} sx={{ px: 1.2, py: 0.5, borderRadius: 1, bgcolor: "rgba(255,255,255,0.06)" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "common.white", letterSpacing: 0.2 }}>
            HelpStudyAbroad
          </Typography>
        </Paper>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ flex: 1, px: 1 }}>
        {NAV.map((item) => {
          const active = router.pathname.startsWith(item.href);
          return (
            <ListItem key={item.href} disablePadding sx={{ my: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  py: 1.2,
                  borderRadius: 1.5,
                  color: active ? "primary.contrastText" : "rgba(255,255,255,0.9)",
                  bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 42, color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box sx={{ mt: "auto", p: 2 }}>
        <Typography variant="caption" color="rgba(255,255,255,0.7)">
          Signed in as
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <Avatar sx={{ bgcolor: "secondary.main" }}>{userInitial}</Avatar>
          <Box sx={{ lineHeight: 1 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.95)" }}>
              {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username : "Guest"}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.6)">
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>

        <Button fullWidth variant="outlined" sx={{ mt: 2, color: "white", borderColor: "rgba(255,255,255,0.12)" }} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar: gradient + glass */}
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 2,
          background: "linear-gradient(90deg, #0ea5a4 0%, #6366f1 100%)",
          color: "white",
          backdropFilter: "saturate(120%) blur(6px)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="open drawer" sx={{ color: "white" }}>
                <MenuIcon />
              </IconButton>
            )}

            <Link href="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
                HelpStudyAbroad
              </Typography>
            </Link>

            {!isMobile && (
              <Box
                sx={{
                  ml: 3,
                  bgcolor: "rgba(255,255,255,0.08)",
                  px: 1,
                  py: 0.4,
                  borderRadius: 1,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} style={{ textDecoration: "none" }}>
                    <Button
                      sx={{
                        textTransform: "none",
                        color: "rgba(255,255,255,0.95)",
                        fontWeight: router.pathname.startsWith(n.href) ? 700 : 600,
                      }}
                    >
                      {n.label}
                    </Button>
                  </Link>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.12)",
                px: 1.2,
                py: 0.35,
                borderRadius: 2,
                minWidth: 200,
              }}
            >
              <SearchIcon sx={{ mr: 1, color: "rgba(255,255,255,0.9)" }} />
              <InputBase
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputProps={{ "aria-label": "search" }}
                sx={{ color: "inherit", width: "100%" }}
              />
              {search ? (
                <IconButton size="small" onClick={() => setSearch("")} sx={{ color: "white" }}>
                  <Typography variant="button" sx={{ opacity: 0.8 }}>
                    Clear
                  </Typography>
                </IconButton>
              ) : null}
            </Box>

            <Tooltip title="Notifications">
              <IconButton sx={{ color: "white", ml: 0.5 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton sx={{ color: "white" }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username : "Guest"}>
              <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: "secondary.main" }}>{userInitial}</Avatar>
              </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={openProfile} onClose={handleProfileClose} PaperProps={{ sx: { minWidth: 220 } }}>
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2">{user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username : "Guest"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || ""}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  router.push("/profile");
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: "primary.main", width: 28, height: 28 }}>P</Avatar>
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  handleLogout();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer: temporary on mobile, permanent on md+ */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="sidebar">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "background.paper" },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              top: 64,
              height: "calc(100% - 64px)",
              bgcolor: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
              color: "white",
              border: "none",
              px: 1,
            },
          }}
          open
        >
          {/* Permanent drawer needs a wrapper with custom background */}
          <Box sx={{ height: "100%", bgcolor: "transparent", color: "white" }}>{drawerContent}</Box>
        </Drawer>
      </Box>

      {/* Main */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          {children}
        </Container>

        <Box component="footer" sx={{ mt: 4, py: 3, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} HelpStudyAbroad · Frontend Technical Assessment
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
