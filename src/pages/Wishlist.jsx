import { Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, token } = useApp();

  if (!token) {
    return (
      <div className="container text-center py-5">
        <div className="display-1 text-muted mb-3">🔐</div>
        <h3 className="text-muted fw-bold">Access Denied</h3>
        <p className="text-secondary small">
          Please log in to view your wishlist.
        </p>
        <Link
          to="/profile"
          className="btn btn-dark mt-2 px-4 btn-sm rounded-pill text-decoration-none"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container text-center py-5">
        <div className="display-1 text-muted mb-3">❤️</div>
        <h3 className="text-muted fw-bold">Your Wishlist is Empty</h3>
        <p className="text-secondary small">
          Save items you love and find them here.
        </p>
        <Link
          to="/products"
          className="btn btn-dark mt-2 px-4 btn-sm rounded-pill text-decoration-none"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4">My Wishlist ({wishlist.length})</h3>

      <div className="row g-4">
        {wishlist.map((item, index) => {
          // Wishlist stores direct product refs after populate
          const product = item._id ? item : item.product;

          return (
            <div
              className="col-12 col-sm-6 col-lg-4"
              key={product?._id || index}
            >
              <div className="card h-100 border-light shadow-sm rounded-4 overflow-hidden">
                {/* Product Image */}
                <img
                  src={
                    product?.image ||
                    product?.imageUrl ||
                    "https://placehold.co/400x200?text=No+Image"
                  }
                  alt={product?.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x200?text=No+Image"; // ✅ fallback if image URL breaks
                  }}
                />

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{product?.name}</h5>
                    <span className="badge bg-light text-dark border small mb-2">
                      {product?.category}
                    </span>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="fs-5 fw-bold text-primary">
                        ${product?.price}
                      </span>
                      <span className="text-warning small">
                        ★ {product?.rating || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column gap-2 mt-3">
                    <button
                      className="btn btn-dark btn-sm w-100 fw-bold"
                      onClick={() => {
                        addToCart(product?._id, 1);
                        removeFromWishlist(product?._id);
                      }}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => removeFromWishlist(product?._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
