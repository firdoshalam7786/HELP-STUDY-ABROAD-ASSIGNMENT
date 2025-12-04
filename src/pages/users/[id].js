import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../components/ProtectedRoute";
import useUsersStore from "../../store/useUsersStore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import Link from "next/link";

export default function SingleUserPage() {
  const router = useRouter();
  const { id } = router.query;

  const fetchUserById = useUsersStore((s) => s.fetchUserById);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      const data = await fetchUserById(id);
      setUser(data);
      setLoading(false);
    };

    load();
  }, [id]);

  return (
    <ProtectedRoute>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          User Details
        </Typography>

        {/* Back Button */}
        <Link href="/users" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ mb: 3 }}>
            Back to Users
          </Button>
        </Link>

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* User Detail Card */}
        {!loading && user && (
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Grid container spacing={3}>
                {/* Left Side */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <img
                      src={user.image}
                      alt={user.firstName}
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "1rem",
                      }}
                    />
                    <Typography variant="h6">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.gender.toUpperCase()}
                    </Typography>
                  </Box>
                </Grid>

                {/* Right Side */}
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {user.email}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {user.phone}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Birth Date:</strong> {user.birthDate}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Company:</strong> {user.company?.name}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {user.address?.address},{" "}
                    {user.address?.city}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Department:</strong> {user.company?.department}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>University:</strong> {user.university}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* If user not found */}
        {!loading && !user && (
          <Typography color="error" sx={{ mt: 4 }}>
            User not found.
          </Typography>
        )}
      </Box>
    </ProtectedRoute>
  );
}
