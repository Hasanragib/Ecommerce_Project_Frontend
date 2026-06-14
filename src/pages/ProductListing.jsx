import { Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function ProductListing({ selectedCategoryFromHome }) {
  const {
    products,
    categories,
    addToCart,
    addToWishlist,
    searchQuery,
    selectedCategories,
    setSelectedCategories,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    clearFilters,
  } = useApp();

  // Handle Category Filtering Selection
  const handleCategoryCheckbox = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories((prev) => prev.filter((c) => c !== cat));
    } else {
      setSelectedCategories((prev) => [...prev, cat]);
    }
  };

  // Filter Pipeline Engine
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(
      (p) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category),
    )
    .filter((p) => p.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === "LOW_TO_HIGH") return a.price - b.price;
      if (sortBy === "HIGH_TO_LOW") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar Filters Section */}
        <aside className="col-12 col-md-3 p-3 bg-white border rounded shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Filters</h5>
            <button
              className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>

          {/* Sort By Price Options */}
          <div className="mb-4">
            <h6 className="fw-bold text-muted small uppercase">
              Sort By Price
            </h6>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="sortPrice"
                id="lowHigh"
                checked={sortBy === "LOW_TO_HIGH"}
                onChange={() => setSortBy("LOW_TO_HIGH")}
              />
              <label className="form-check-input-label small" htmlFor="lowHigh">
                Price: Low to High
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="sortPrice"
                id="highLow"
                checked={sortBy === "HIGH_TO_LOW"}
                onChange={() => setSortBy("HIGH_TO_LOW")}
              />
              <label className="form-check-input-label small" htmlFor="highLow">
                Price: High to Low
              </label>
            </div>
          </div>

          {/* Categories Filter Block */}
          <div className="mb-4">
            <h6 className="fw-bold text-muted small uppercase">Categories</h6>
            {categories.map((cat) => (
              <div className="form-check" key={cat}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryCheckbox(cat)}
                />
                <label className="form-check-label small" htmlFor={cat}>
                  {cat}
                </label>
              </div>
            ))}
          </div>

          {/* Ratings Range Threshold Slider */}
          <div className="mb-3">
            <h6 className="fw-bold text-muted small uppercase d-flex justify-content-between">
              <span>Min Rating</span>
              <span className="badge bg-secondary">{minRating} ⭐+</span>
            </h6>
            <input
              type="range"
              className="form-range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </div>
        </aside>

        {/* Core Storefront Products Grid Display */}
        <main className="col-12 col-md-9">
          <h4 className="fw-bold mb-4">
            Showing Products ({filteredProducts.length})
          </h4>
          <div className="row g-4">
            {filteredProducts.map((prod) => (
              <div key={prod._id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm border-light">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold mb-1">{prod.name}</h5>
                      <div className="d-flex justify-content-between align-items-center small my-2">
                        <span className="badge bg-light text-dark border">
                          {prod.category}
                        </span>
                        <span className="text-warning">
                          ★ {prod.rating || 4.2}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="fs-4 fw-bold text-dark mb-3">
                        ${prod.price}
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm flex-grow-1">
                          <Link
                            to={`/product/${prod._id}`}
                            className="card-link text-light text-decoration-none "
                          >
                            View
                          </Link>
                        </button>
                        <button
                          className="btn btn-primary btn-sm flex-grow-1"
                          onClick={() => addToCart(prod._id, 1)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => addToWishlist(prod._id)}
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
