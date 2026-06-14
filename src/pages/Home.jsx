import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function Home() {
  const { categories, setSelectedCategories } = useApp();
  const navigate = useNavigate();

  // Updates the global filter state and redirects the user to the store view
  const handleCategoryShortcut = (categoryName) => {
    setSelectedCategories([categoryName]);
    navigate("/products");
  };

  return (
    <div className="container my-5 animate-fade-in">
      {/* SECTION 1: Immersive Hero Banner */}
      <div className="py-5 px-4 p-md-5 bg-dark text-white rounded-5 shadow mb-5 position-relative overflow-hidden text-center text-md-start">
        <div className="row align-items-center py-4">
          <div className="col-12 col-md-7 px-lg-4 z-1">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold text-uppercase mb-3 tracking-wider small">
              New Releases Arrived
            </span>
            <h1 className="display-3 fw-black tracking-tight text-white mb-3 lh-1">
              Next-Gen Tech <br className="d-none d-lg-inline" />
              &amp; Daily Essentials.
            </h1>
            <p className="text-white-50 lead mb-4 col-lg-10">
              Explore your personalized shop ecosystem.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
              <Link
                to="/products"
                className="btn btn-warning text-dark font-weight-bold rounded-pill px-4 py-2.5 text-decoration-none fw-bold shadow-sm"
              >
                Browse Full Catalog
              </Link>
              <Link
                to="/wishlist"
                className="btn btn-outline-light rounded-pill px-4 py-2.5 text-decoration-none"
              >
                View Saved Items
              </Link>
            </div>
          </div>

          {/* Subtle Decorative Backdrop Graphic Column */}
          <div className="col-12 col-md-5 text-center d-none d-md-block opacity-25">
            <span style={{ fontSize: "10rem" }}>🚀</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic Category Cards Mapping */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            Shop by Featured Collections
          </h3>
          <p className="text-muted small mb-0">
            Select a specific segment below to instantly initialize filters.
          </p>
        </div>
        <Link
          to="/products"
          className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 text-decoration-none fw-bold"
        >
          View All →
        </Link>
      </div>

      <div className="row g-4">
        {categories.length === 0
          ? // Fallback UI block if categories array hasn't completed parsing from the API stream yet
            [1, 2, 3].map((placeholderIndex) => (
              <div className="col-12 col-md-4" key={placeholderIndex}>
                <div
                  className="card border-0 shadow-sm bg-light p-5 h-100 placeholder-glow"
                  style={{ minHeight: "160px" }}
                >
                  <span className="placeholder col-6 bg-secondary rounded mb-2"></span>
                  <span className="placeholder col-4 bg-secondary rounded small"></span>
                </div>
              </div>
            ))
          : categories.map((cat, index) => (
              <div className="col-12 col-md-4" key={index}>
                <div
                  className="card border-0 shadow-sm bg-light text-dark p-4 p-lg-5 h-100 rounded-4 d-flex flex-column justify-content-between position-relative card-hover-effect transition-all"
                  style={{ cursor: "pointer", minHeight: "170px" }}
                  onClick={() => handleCategoryShortcut(cat)}
                >
                  <div>
                    <span className="text-muted small text-uppercase fw-bold tracking-widest block mb-1">
                      Collection Suite 0{index + 1}
                    </span>
                    <h4 className="fw-bold text-capitalize text-dark mb-0">
                      {cat}
                    </h4>
                  </div>
                  <div className="text-primary small fw-bold d-flex align-items-center gap-1 mt-4">
                    Explore Products
                    <span className="transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
