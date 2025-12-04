import { create } from "zustand";
import axios from "axios";

const LIMIT = 10;

const useUsersStore = create((set, get) => ({
  users: [],
  total: 0,
  page: 0,
  limit: LIMIT,
  search: "",
  loading: false,
  cache: {},

  // actions
  setSearch: (q) => set({ search: q, page: 0 }),
  setPage: (p) => set({ page: p }),

  // fetchUsers (robust, tokenized fallback included)
  fetchUsers: async () => {
    const { page, limit, search, cache } = get();
    const skip = page * limit;
    const cacheKey = `${search || ""}_${page}`;

    if (cache[cacheKey]) {
      const data = cache[cacheKey];
      set({ users: data.users, total: data.total, loading: false });
      return;
    }

    set({ loading: true });

    try {
      const qRaw = (search || "").trim();
      let usersArr = [];
      let totalCount = 0;

      const fetchSearch = async (q) => {
        const url = `https://dummyjson.com/users/search?q=${encodeURIComponent(
          q
        )}&limit=${limit}&skip=${skip}`;
        const r = await axios.get(url, { timeout: 10000 });
        return {
          users: Array.isArray(r.data?.users) ? r.data.users : [],
          total:
            typeof r.data?.total === "number"
              ? r.data.total
              : Array.isArray(r.data?.users)
              ? r.data.users.length
              : 0,
        };
      };

      if (qRaw.length > 0) {
        // try full query
        const full = await fetchSearch(qRaw);
        usersArr = full.users;
        totalCount = full.total;

        // if empty and multi-token merge token results
        if (usersArr.length === 0 && qRaw.includes(" ")) {
          const tokens = Array.from(new Set(qRaw.split(/\s+/).filter(Boolean)));
          const mergedMap = new Map();
          for (const t of tokens) {
            const resT = await fetchSearch(t);
            (resT.users || []).forEach((u) => {
              if (!mergedMap.has(u.id)) mergedMap.set(u.id, u);
            });
          }
          usersArr = Array.from(mergedMap.values());
          totalCount = usersArr.length;
        }

        // final fallback list for page
        if (usersArr.length === 0) {
          const listUrl = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
          const listRes = await axios.get(listUrl, { timeout: 10000 });
          usersArr = Array.isArray(listRes.data?.users)
            ? listRes.data.users
            : [];
          totalCount =
            typeof listRes.data?.total === "number"
              ? listRes.data.total
              : usersArr.length;
        }
      } else {
        // no search paginated list
        const url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
        const res = await axios.get(url, { timeout: 10000 });
        usersArr = Array.isArray(res.data?.users) ? res.data.users : [];
        totalCount =
          typeof res.data?.total === "number"
            ? res.data.total
            : usersArr.length;
      }

      const result = { users: usersArr, total: totalCount };

      set({ users: result.users, total: result.total, loading: false });

      // cache
      get().cache[cacheKey] = result;
    } catch (err) {
      console.error(
        "fetchUsers error:",
        err.response?.data || err.message || err
      );
      set({ users: [], total: 0, loading: false });
    }
  },

  // fetch a single user by id (returns data or null)
  fetchUserById: async (id) => {
    try {
      if (!id) return null;
      const res = await axios.get(`https://dummyjson.com/users/${id}`, {
        timeout: 10000,
      });
      return res.data || null;
    } catch (err) {
      console.error(
        "fetchUserById error:",
        err.response?.data || err.message || err
      );
      return null;
    }
  },
}));

export default useUsersStore;
