// src/pages/products/index.js
import React, { useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import useProductsStore from "../../store/useProductsStore";
import {
  Box,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  FormHelperText,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import ProductCard from "../../components/ProductCard";

export default function ProductsListPage() {
  const router = useRouter();

  // read from store
  const products = useProductsStore((s) => s.products) || [];
  const categories = useProductsStore((s) => s.categories) || [];
  const total = useProductsStore((s) => s.total) || 0;
  const page = useProductsStore((s) => s.page);
  const limit = useProductsStore((s) => s.limit);
  const search = useProductsStore((s) => s.search) || "";
  const category = useProductsStore((s) => s.category) || "all";
  const loading = useProductsStore((s) => s.loading);

  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const fetchCategories = useProductsStore((s) => s.fetchCategories);
  const setSearch = useProductsStore((s) => s.setSearch);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setPage = useProductsStore((s) => s.setPage);

  const pageCount = Math.max(1, Math.ceil(total / limit));

  // load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: "100vh", py: 4 }}>
        {/* PAGE HEADER + BACK BUTTON */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Products List
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{
              px: 2,
              m: 3,
              py: 1.2,
              height: 44,
              borderRadius: 2,
              fontWeight: 600,
            }}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Search + Category Filter */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description"
            />
            <FormHelperText sx={{ mt: 1 }}>
              Use search to filter products.
            </FormHelperText>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>

              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {categories.map((c) => {
                  const label =
                    typeof c === "string"
                      ? c
                      : c?.name || c?.slug || JSON.stringify(c);
                  return (
                    <MenuItem key={label} value={label}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Loader */}
        {loading && (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* No products */}
        {!loading && products.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            No products found.
          </Typography>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <ProductCard
                  p={p}
                  onClick={(id) => router.push(`/products/${id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {!loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={pageCount}
              page={page + 1}
              onChange={(e, value) => setPage(value - 1)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </ProtectedRoute>
  );
}
