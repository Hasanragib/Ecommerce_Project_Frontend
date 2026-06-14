import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { apiRequest } from "../utils/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, toggleWishlist, wishlist, addToCart } = useApp();

  // Local state for this specific product's backend data payload
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync lifecycle logic to query the database whenever the URL ID variable modifies
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiRequest(`/api/products/${id}`)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to parse product metadata.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Derived state calculations checking context maps to see if badges should light up
  const isWishlisted = wishlist.some((item) => item._id === id);
  const cartItem = cart.find((item) => item.product?._id === id);
  const isInCart = !!cartItem;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark mb-2" role="status">
          <span className="visually-hidden">Hydrating item spec models...</span>
        </div>
        <p className="text-muted small">Loading product characteristics...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-light border rounded-4 max-w-md mx-auto p-4 shadow-sm">
          <span className="fs-3">⚠️</span>
          <h5 className="fw-bold mt-2 text-dark">Data Fault</h5>
          <p className="text-muted small mb-3">
            {error || "The requested item specification entry does not exist."}
          </p>
          <Link
            to="/products"
            className="btn btn-sm btn-dark rounded-pill px-4"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 animate-fade-in">
      {/* Breadcrumb utility locator navigation trail */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/" className="text-muted text-decoration-none">
              Home
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="text-muted text-decoration-none">
              Products
            </Link>
          </li>
          <li
            className="breadcrumb-item active text-dark fw-semibold text-capitalize"
            aria-current="page"
          >
            {product.category}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* LEFT COMPONENT: Visual Aspect Presentation Layer */}
        <div className="col-12 col-md-6">
          <div
            className="card border-0 bg-light rounded-5 p-4 p-lg-5 text-center shadow-sm d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded-4 object-fit-contain transition-all"
                style={{ maxHeight: "320px", mixBlendMode: "multiply" }}
              />
            ) : (
              <span style={{ fontSize: "7rem" }} className="opacity-50">
                📦
              </span>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Operational Specification & State Actions */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
          <div>
            {/* Category badge context wrapper */}
            <span className="badge bg-light text-secondary border text-uppercase px-3 py-2 rounded-pill tracking-wider fw-bold small mb-3">
              {product.category}
            </span>

            <h2 className="fw-black text-dark mb-2 tracking-tight display-6">
              {product.name}
            </h2>

            {/* Star ratings representation */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="text-warning fs-5">
                {"★".repeat(Math.round(product.rating || 4))}
              </span>
              <span className="text-muted small fw-semibold">
                ({product.rating || "4.5"} / 5.0 )
              </span>
            </div>

            <div className="fs-3 fw-bold text-primary mb-4">
              ${product.price}
            </div>

            <hr className="border-light my-4" />

            <h6 className="fw-bold text-dark small text-uppercase tracking-wide mb-2">
              Technical Description
            </h6>
            <p className="text-secondary lh-base mb-4 small">
              {product.description ||
                "No supplemental manifest parameters provided for this catalog item profile. Standard high-grade build properties apply."}
            </p>

            {/* Inventory Status Alert Badge */}
            <div className="d-flex align-items-center gap-2 mb-4 small text-muted">
              <span
                className="bg-success rounded-circle"
                style={{ width: "8px", height: "8px" }}
              ></span>
              <span>Available Inventory</span>
            </div>
          </div>

          {/* Action trigger deck interface blocks */}
          <div className="d-flex flex-column sm-flex-row gap-3 mt-4">
            {isInCart ? (
              <button
                className="btn btn-dark py-3 px-4 rounded-pill fw-bold text-uppercase shadow-sm flex-grow-1"
                onClick={() => navigate("/cart")}
              >
                🛒 View in Shopping Bag ({cartItem.quantity})
              </button>
            ) : (
              <button
                className="btn btn-primary py-3 px-4 rounded-pill fw-bold text-uppercase shadow-sm flex-grow-1"
                onClick={() => addToCart(product)}
              >
                ➕ Add to Cart
              </button>
            )}

            <button
              className={`btn py-3 px-4 rounded-pill fw-bold text-uppercase transition-all ${
                isWishlisted
                  ? "btn-danger text-white shadow-sm"
                  : "btn-outline-secondary"
              }`}
              onClick={() => toggleWishlist(product)}
              style={{ minWidth: "160px" }}
            >
              {isWishlisted ? "❤️ Saved" : "🤍 Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
