import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
} from "@mui/material";
import useProductsStore from "../../store/useProductsStore";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const fetchProductById = useProductsStore((s) => s.fetchProductById);

  const [product, setProduct] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        setImgIndex(0);
      } catch (err) {
        console.error("Error loading product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductById]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading product...</Typography>
        </Box>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h6">Product not available.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This may be a network issue or the product does not exist.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => router.push("/products")}
          >
            Back to Products
          </Button>
        </Box>
      </ProtectedRoute>
    );
  }

  const images = product.images || [];
  const mainImage = images[imgIndex] || product.thumbnail;

  return (
    <ProtectedRoute>
      <Box sx={{ p: 2 }}>
        {/* Back Button */}
        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => router.push("/products")}
        >
          ← Back to Products
        </Button>

        <Grid container spacing={3}>
          {/* LEFT COLUMN — IMAGES */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                height="350"
                image={mainImage}
                alt={product.title}
                sx={{ objectFit: "contain", p: 2, background: "#fff" }}
              />
            </Card>

            {/* Image Thumbnails */}
            <Grid container spacing={1}>
              {images.map((img, index) => (
                <Grid item xs={3} key={index}>
                  <Paper
                    elevation={imgIndex === index ? 4 : 1}
                    sx={{
                      cursor: "pointer",
                      border:
                        imgIndex === index
                          ? "2px solid #1976d2"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setImgIndex(index)}
                  >
                    <CardMedia
                      component="img"
                      height="80"
                      image={img}
                      alt={`image-${index}`}
                      sx={{ objectFit: "contain", p: 1 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* RIGHT COLUMN — DETAILS */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {product.title}
            </Typography>

            <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
              {product.brand} — {product.category}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Price: ${product.price}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              ⭐ Rating: {product.rating}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              Stock: {product.stock}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Warranty: {product.warrantyInformation || "N/A"}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => alert("Demo only — No cart implemented")}
            >
              Add to Cart
            </Button>

            <Button variant="outlined" onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}
