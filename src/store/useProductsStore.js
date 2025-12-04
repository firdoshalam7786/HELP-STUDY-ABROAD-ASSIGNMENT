import axios from "axios";
import { create } from "zustand";

const useProductsStore = create((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  limit: 10,
  page: 0,
  search: "",
  category: "all",
  loading: false,

fetchCategories: async () => {
  try {
    set({ loading: true });

    const res = await axios.get("https://dummyjson.com/products/categories");
    let cats = res.data;

    // If API returned an array of objects, map to a display string
    if (Array.isArray(cats) && cats.length > 0 && typeof cats[0] === "object") {
      cats = cats.map((c) => {
        // prefer name, then slug, then url, else JSON stringify
        return c?.name || c?.slug || c?.url || JSON.stringify(c);
      });
    }

    // Ensure array of strings
    cats = Array.isArray(cats) ? cats.map(String) : [];

    set({ categories: cats, loading: false });
  } catch (err) {
    console.error("fetchCategories error:", err);
    set({ categories: [], loading: false });
  }
},

  // FETCH PRODUCT LIST (pagination + search + category)
  fetchProducts: async () => {
    try {
      set({ loading: true });

      const { page, limit, search, category } = get();
      let url = `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`;

      if (search) {
        url = `https://dummyjson.com/products/search?q=${search}`;
      } else if (category !== "all") {
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${page * limit}`;
      }

      const res = await axios.get(url);

      set({
        products: res.data.products,
        total: res.data.total,
        loading: false,
      });
    } catch (err) {
      console.error("fetchProducts error:", err);
      set({ products: [], loading: false });
    }
  },

  // FETCH SINGLE PRODUCT (DETAIL PAGE)
  fetchProductById: async (id) => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      return res.data; // return data to detail page
    } catch (err) {
      console.error("fetchProductById error:", err);
      return null;
    }
  },

  // UI controls
  setSearch: (v) => set({ search: v, page: 0 }),
  setCategory: (v) => set({ category: v, page: 0 }),
  setPage: (v) => set({ page: v }),
}));

export default useProductsStore;
