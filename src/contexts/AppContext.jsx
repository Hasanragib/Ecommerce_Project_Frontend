import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Initialize state cleanly from localStorage to keep users logged in on refresh
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("");

  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinRating(0);
    setSortBy("");
    setSearchQuery("");
  };

  // =========================================================================
  // AUTHENTICATION FUNCTIONALITY CORE
  // =========================================================================

  // 1. Login Function: Fires network requests to Express, then saves sessions
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      // Hit your actual Express auth route endpoint
      const res = await apiRequest("/api/auth/login", "POST", {
        email,
        password,
      });

      if (res && res.success) {
        // Adapt to your actual backend response shape (assuming res.data houses user data)
        const userData = res.user;
        const userToken = res.token;

        if (!userData && !userToken) {
          throw new Error("Missing credentials in server.");
        }

        // Save to browser memory so state survives page refreshes
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);

        // Hydrate App React State
        setToken(userToken);
        setUser(userData);

        triggerAlert("Welcome back, " + (userData.name || "User") + "!");
        return true;
      } else {
        throw new Error(res.message || "Failed to process login.");
      }
    } catch (err) {
      console.error("Login failure trace details:", err);
      triggerAlert(
        err.message ||
          "Invalid authentication credentials, please check the details.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. Logout Function: Clears memory streams completely
  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    setAddresses([]);
    setOrders([]);
    triggerAlert("Session terminated. Logged out successfully.");
  };

  // =========================================================================
  // APP INITIALIZATION LIFECYCLE
  // =========================================================================
  useEffect(() => {
    async function initShop() {
      setLoading(true);
      try {
        const prodData = await apiRequest("/api/products");
        setProducts(prodData || []);
        const catData = await apiRequest("/api/categories");
        setCategories(catData?.data?.categories || []);

        if (token) {
          const profile = await apiRequest(
            "/api/users/userProfile/me",
            "GET",
            null,
            token,
          );
          if (profile.success) {
            setCart(profile.data.cart || []);
            setWishlist(profile.data.wishlist || []);
            setAddresses(profile.data.addresses || []);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    initShop();
  }, [token]);

  // =========================================================================
  // E-COMMERCE OPERATIONAL HANDLERS
  // =========================================================================
  const addToCart = async (productId, quantityChange = 1) => {
    if (!token)
      return triggerAlert("Please login to manage your shopping cart.");
    try {
      // new absolute quantity from current cart state
      const existingItem = cart.find((item) => item.product?._id === productId);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQty = currentQty + quantityChange;

      if (newQty <= 0) {
        return removeFromCart(productId);
      }

      const res = await apiRequest(
        "/api/users/cart",
        "POST",
        { productId, quantity: newQty }, // absolute value, not +1/-1
        token,
      );
      if (res.success) {
        setCart(res.data);
        triggerAlert(
          quantityChange > 0
            ? "Added item to the cart!"
            : "Updated item in the cart!",
        );
      }
    } catch (err) {
      triggerAlert(err.message);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token)
      return triggerAlert("Please login to manage your shopping cart.");
    try {
      const res = await apiRequest(
        "/api/users/cart",
        "DELETE",
        { productId },
        token,
      );
      if (res.success) {
        setCart(res.data);
      }
      triggerAlert("Removed item from the cart");
    } catch (err) {
      // fallback
      setCart((prev) => prev.filter((item) => item.product?._id !== productId));
      triggerAlert("Removed item from the cart");
    }
  };

  const addToWishlist = async (productId) => {
    if (!token) return triggerAlert("Please login to manage your wishlist.");
    try {
      const res = await apiRequest(
        "/api/users/wishlist",
        "POST",
        { productId },
        token,
      );
      if (res.success) {
        setWishlist(res.data); // ✅ use server response
        triggerAlert("Added item to the wishlist");
      }
    } catch (err) {
      triggerAlert(err.message);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return triggerAlert("Please login to manage your wishlist.");
    try {
      const res = await apiRequest(
        "/api/users/wishlist",
        "DELETE",
        { productId },
        token,
      );
      if (res.success) {
        setWishlist(res.data);
        triggerAlert("Removed item from the wishlist");
      }
    } catch (err) {
      // fallback
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      triggerAlert("Removed item from the wishlist");
    }
  };

  const addAddress = async (addressObj) => {
    if (!token) return triggerAlert("Please login to manage addresses.");
    try {
      const res = await apiRequest(
        "/api/users/address",
        "POST",
        addressObj,
        token,
      );
      if (res.success) {
        setAddresses(res.data); // updatedUser.addresses
        triggerAlert("Address added successfully!");
      }
    } catch (err) {
      triggerAlert(err.message);
    }
  };

  const placeOrder = async (orderPayload) => {
    setLoading(true);
    setOrders((prev) => [
      ...prev,
      {
        ...orderPayload,
        date: new Date().toLocaleDateString(),
        id: Math.random(),
      },
    ]);
    setCart([]);
    setLoading(false);
    triggerAlert("Order Placed Successfully.");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        products,
        categories,
        cart,
        addresses,
        addAddress,
        wishlist,
        orders,
        loading,
        alertMessage,
        searchQuery,
        setSearchQuery,
        selectedCategories,
        setSelectedCategories,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        clearFilters,
        loginUser,
        logoutUser,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        placeOrder,
        triggerAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
