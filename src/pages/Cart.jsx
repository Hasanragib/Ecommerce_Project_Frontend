import { Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function Cart() {
  const { cart, addToCart, removeFromCart, addToWishlist, triggerAlert } =
    useApp();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = cart.reduce(
    (acc, item) => acc + (item.product?.price ?? 0) * (item.quantity ?? 0),
    0,
  );
  const deliveryCharges = itemsPrice > 500 || itemsPrice === 0 ? 0 : 50;
  const finalCheckoutAmount = itemsPrice + deliveryCharges;

  const handleMoveToWishlist = (productId) => {
    addToWishlist(productId);
    removeFromCart(productId);
    triggerAlert("Moved item from the cart to the wishlist");
  };

  // 1. Empty Cart Screen: Uses a Link component to go back to products safely
  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-muted">Your Shopping Bag is Empty</h3>
        <Link to="/" className="btn btn-dark mt-3 px-4 btn-sm">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4">Your Shopping Cart ({totalItems} items)</h3>
      <div className="row g-4">
        {/* Cart Listing Stream */}
        <div className="col-12 col-lg-8">
          {cart.map((item, index) => (
            <div
              className="card mb-3 p-3 border-light shadow-sm"
              key={item._id || item.product?._id || index}
            >
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="fw-bold mb-1">{item.product?.name}</h5>
                  <p className="text-muted small mb-0">
                    Category: {item.product?.category}
                  </p>
                  <div className="fw-bold text-primary mt-2">
                    ${item.product?.price}
                  </div>
                </div>

                {/* Quantity Control Actions */}
                <div className="col-md-3 d-flex align-items-center gap-2 my-2 my-md-0">
                  <button
                    className="btn btn-sm btn-outline-secondary px-2 py-0"
                    onClick={() =>
                      item.quantity > 1
                        ? addToCart(item.product?._id, -1)
                        : removeFromCart(item.product?._id)
                    }
                  >
                    -
                  </button>
                  <span className="fw-bold px-2">{item.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary px-2 py-0"
                    onClick={() => addToCart(item.product?._id, 1)}
                  >
                    +
                  </button>
                </div>

                <div className="col-md-3 text-md-end">
                  <button
                    className="btn btn-sm btn-link text-secondary d-block w-100 text-md-end mb-1"
                    onClick={() => handleMoveToWishlist(item.product?._id)}
                  >
                    Move to Wishlist
                  </button>
                  <button
                    className="btn btn-sm btn-link text-danger d-block w-100 text-md-end"
                    onClick={() => removeFromCart(item.product?._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Billing Ledger Component Card */}
        <div className="col-12 col-lg-4">
          <div className="card p-4 border-0 bg-light shadow-sm">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Price Details</h5>
            <div className="d-flex justify-content-between mb-2 small">
              <span>Price ({totalItems} Items)</span>
              <span>${itemsPrice}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span>Delivery Packing Charges</span>
              <span
                className={
                  deliveryCharges === 0 ? "text-success fw-bold" : "text-dark"
                }
              >
                {deliveryCharges === 0 ? "FREE" : `$${deliveryCharges}`}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4 fw-bold text-dark fs-5">
              <span>Total Amount</span>
              <span>${finalCheckoutAmount}</span>
            </div>

            {/* 2. Fixed Checkout Button: Link styled directly as a Bootstrap button */}
            <Link
              to="/checkout"
              className="btn btn-dark w-100 py-2 text-center text-white text-decoration-none"
            >
              Proceed To Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
