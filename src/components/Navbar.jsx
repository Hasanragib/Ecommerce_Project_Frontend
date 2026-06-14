import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function Navbar() {
  // ✅ removed setPage prop
  const { cart, wishlist, searchQuery, setSearchQuery, user } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    navigate("/products"); // ✅ auto-navigate to products on search
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-3 sticky-top shadow">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand fw-bold fs-4 text-dark text-decoration-none"
        >
          <span className="fs-3">🛒</span> Electronica
        </Link>

        {/* Search */}
        <div
          className="mx-auto my-2 my-lg-0"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <input
            type="text"
            className="form-control rounded-pill px-3"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearch} // ✅ navigates + updates query
          />
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link
            to="/wishlist"
            className="text-dark fw-semibold text-decoration-none position-relative"
          >
            <span className="fs-5">❤️</span> Wishlist
            {wishlist.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="text-dark fw-semibold text-decoration-none position-relative mx-3"
          >
            <span className="fs-5">💼</span> Cart
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                {cart.length}
              </span>
            )}
          </Link>

          <Link to="/profile" className="btn btn-outline-dark btn-sm">
            👤 {user ? user.name : "Profile"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
