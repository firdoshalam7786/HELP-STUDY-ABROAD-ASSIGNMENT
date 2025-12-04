import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import useUsersStore from "../../store/useUsersStore";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Pagination,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  InputAdornment,
  Button,
  useMediaQuery,
  FormHelperText,
  Skeleton,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function UsersListPage() {
  // store selectors
  const users = useUsersStore((s) => s.users) || [];
  const total = useUsersStore((s) => s.total) || 0;
  const page = useUsersStore((s) => s.page) || 0;
  const limit = useUsersStore((s) => s.limit) || 10;
  const search = useUsersStore((s) => s.search) || "";
  const loading = useUsersStore((s) => s.loading);

  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const setSearch = useUsersStore((s) => s.setSearch);
  const setPage = useUsersStore((s) => s.setPage);

  // local search state with debounce so we don't fire on every keystroke
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => {
      // only update store search when debounced value changes
      if ((localSearch || "").trim() !== (search || "").trim()) {
        setSearch(localSearch.trim());
        // reset to first page on new search
        setPage(0);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch]);

  // fetch users when page or search (store) changes
  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // page count
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const isMobile = useMediaQuery("(max-width:600px)");

  // helper to render avatar initials
  const avatarFrom = (u) => {
    const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    if (!name) return "U";
    return name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: "100vh", py: 4 }}>
        {/* Header with Back button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            minHeight: "72px",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Users
          </Typography>

          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{
                px: 1,
                py: 1.4,
                m: 2,
                fontWeight: 600,
                height: 50,
                borderRadius: 2,
              }}
            >
              Back to Dashboard
            </Button>
          </Link>
        </Box>

        {/* Top summary cards + Search */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total users
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {loading ? <Skeleton width={80} /> : total}
                </Typography>
                <FormHelperText>
                  Showing {Math.min(limit, users.length)} users per page
                </FormHelperText>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Current page
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {loading ? <Skeleton width={40} /> : page + 1}
                </Typography>
                <FormHelperText>Page of {pageCount}</FormHelperText>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <TextField
              label="Search users..."
              variant="outlined"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              fullWidth
              placeholder="Search by name, email..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: localSearch ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setLocalSearch("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
        </Grid>

        <FormHelperText sx={{ mb: 2 }}>
          Try searching by first name, email, or company.
        </FormHelperText>

        {/* Loading skeletons */}
        {loading && (
          <Box sx={{ my: 3 }}>
            {!isMobile ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Skeleton width={120} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={120} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={100} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width={140} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton width="60%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton width="80%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton width="50%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton width="70%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton width="60%" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Grid container spacing={2}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Grid item xs={12} key={i}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Skeleton variant="circular" width={48} height={48} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton width="40%" />
                            <Skeleton width="80%" />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Desktop Table */}
        {!loading && !isMobile && users.length > 0 && (
          <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: (t) => t.palette.action.hover }}
                >
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((u, idx) => (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: (t) => t.palette.action.selected,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar>{avatarFrom(u)}</Avatar>
                        <Box>
                          <Link
                            href={`/users/${u.id}`}
                            style={{ textDecoration: "none", color: "#1976d2" }}
                          >
                            <Typography sx={{ fontWeight: 600 }}>
                              {u.firstName} {u.lastName}
                            </Typography>
                          </Link>
                          <Typography variant="caption" color="text.secondary">
                            {u.role || "User"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.gender || "-"} size="small" />
                    </TableCell>
                    <TableCell>{u.phone || "-"}</TableCell>
                    <TableCell>{u.company?.name || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Mobile Cards */}
        {!loading && isMobile && users.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {users.map((u) => (
              <Grid item xs={12} key={u.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 140,
                  }}
                >
                  <CardContent sx={{ pb: 0 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar>{avatarFrom(u)}</Avatar>
                        <Box>
                          <Link
                            href={`/users/${u.id}`}
                            style={{ textDecoration: "none", color: "#1976d2" }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {u.firstName} {u.lastName}
                            </Typography>
                          </Link>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: 13 }}
                          >
                            {u.email}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={u.company?.name ? u.company.name : "No company"}
                        size="small"
                      />
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        Gender: {u.gender || "-"}
                      </Typography>
                      <Typography variant="caption">
                        Phone: {u.phone || "-"}
                      </Typography>
                    </Stack>
                  </CardContent>

                  {/* Button pinned to bottom */}
                  <CardActions sx={{ mt: "auto", px: 2, pb: 2 }}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Link
                        href={`/users/${u.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ManageAccountsIcon />}
                        >
                          Manage
                        </Button>
                      </Link>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty state */}
        {!loading && users.length === 0 && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              No users found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your search or check back later.
            </Typography>
            <Link href="/users/new" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Add new user</Button>
            </Link>
          </Box>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={pageCount}
              page={page + 1}
              onChange={(e, value) => setPage(value - 1)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  );
}
