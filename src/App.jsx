import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useApp } from "./contexts/AppContext";

// Shared Structural Layout Components
import Navbar from "./components/Navbar";

// Domain-Specific Feature Pages
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

export default function App() {
  const { loading, alertMessage } = useApp();

  return (
    <Router>
      <div className="bg-white min-vh-100 d-flex flex-column font-sans-serif">
        {/* Global Navigation Header Bar across all views */}
        <Navbar />

        {/* Global Status Toast Notification Overlay */}
        {alertMessage && (
          <div className="position-fixed bottom-0 end-0 m-4 z-3 alert alert-dark shadow-lg px-4 py-3 border-0 rounded-4 text-white bg-dark bg-opacity-95 d-flex align-items-center gap-2 animate-fade-in">
            ⚡ <span>{alertMessage}</span>
          </div>
        )}

        {/* Global Full-Screen Intercepting Loading Spinner */}
        {loading && (
          <div className="bg-white bg-opacity-75 position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3">
            <div
              className="spinner-border text-dark"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">
                Syncing Core Engine Streams...
              </span>
            </div>
          </div>
        )}

        {/* Client-Side View Router Switching Engine */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            {/* Dynamic segment routing matches your details page strategy */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>

        {/* Permanent Global Layout Footer */}
        <footer className="bg-light text-center py-4 border-top mt-5 small text-muted">
          &copy; 2026 Electronica Storefront Ecosystem.
        </footer>
      </div>
    </Router>
  );
}
