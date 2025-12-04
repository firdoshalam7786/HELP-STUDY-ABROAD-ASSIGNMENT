import React, { useMemo } from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

function ProductCardInner({ p, onClick }) {
  // memoize thumbnail & price string
  const thumbnail = useMemo(
    () => p.thumbnail || (p.images && p.images[0]) || "",
    [p]
  );
  const priceText = useMemo(() => `$${p.price}`, [p.price]);

  return (
    <Card
      onClick={() => onClick?.(p.id)}
      sx={{
        height: "100%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: "transform .16s ease, box-shadow .16s ease",
        ":hover": { transform: "translateY(-6px)", boxShadow: 6 },
      }}
      role="button"
    >
      <CardMedia
        component="img"
        height="180"
        image={thumbnail}
        alt={p.title}
        sx={{ objectFit: "cover", background: "#fff" }}
      />

      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography variant="subtitle1" noWrap>
          {p.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {priceText}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ⭐ {p.rating}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
          noWrap
        >
          {p.category} • {p.brand}
        </Typography>
      </CardContent>
    </Card>
  );
}

// React.memo with shallow prop check: re-render only if product id or key props changed
export default React.memo(ProductCardInner, (prev, next) => {
  // if same id and same price/title/thumbnail -> skip rerender
  return (
    prev.p?.id === next.p?.id &&
    prev.p?.title === next.p?.title &&
    prev.p?.price === next.p?.price &&
    (prev.p?.thumbnail || prev.p?.images?.[0]) ===
      (next.p?.thumbnail || next.p?.images?.[0]) &&
    prev.p?.rating === next.p?.rating
  );
});
