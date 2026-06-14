import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

export default function Checkout() {
  const { cart, placeOrder, addresses } = useApp();
  const navigate = useNavigate();

  // Local state to track which address card index is highlighted/selected
  const [selectedAddress, setSelectedAddress] = useState(0);

  // Calculate prices based on your exact cart shape
  const itemsPrice = cart.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0,
  );
  const deliveryCharges = itemsPrice > 500 || itemsPrice === 0 ? 0 : 45;
  const finalAmount = itemsPrice + deliveryCharges;

  const handleCompletePayment = () => {
    const orderPayload = {
      items: cart,
      deliveryTarget: addresses[selectedAddress],
      totalPaid: finalAmount,
    };

    // 1. Fire context state handler to commit items to history & clear the active cart
    placeOrder(orderPayload);

    // 2. Pivot to user profile to see their new historical order card
    navigate("/profile");
  };

  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <div className="display-1 text-muted mb-3">🛒</div>
        <h3 className="text-muted fw-bold">No Items to Checkout</h3>
        <p className="text-secondary small">
          Your active shopping cart is currently empty.
        </p>
        <Link
          to="/products"
          className="btn btn-dark mt-2 px-4 btn-sm rounded-pill text-decoration-none"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "750px" }}>
      <h3 className="fw-bold mb-4 text-dark">Secure Checkout Hub</h3>

      {/* SECTION 1: Address Selection Cards */}
      <h5 className="fw-bold text-secondary small text-uppercase tracking-wider mb-3">
        1. Shipping Destination
      </h5>
      <div className="row g-3 mb-5">
        {addresses.map((addr, idx) => (
          <div className="col-12 col-sm-6" key={String(addr._id) || idx}>
            <div
              className={`card p-3 h-100 border-2 rounded-4 transition-all shadow-sm ${
                selectedAddress === idx
                  ? "border-primary bg-light bg-opacity-50"
                  : "border-light"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedAddress(idx)}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0 text-dark">{addr.title}</h6>
                <input
                  type="radio"
                  name="shippingAddress"
                  checked={selectedAddress === idx}
                  onChange={() => setSelectedAddress(idx)}
                  className="form-check-input border-secondary"
                />
              </div>
              <p className="text-muted small mb-0 lh-base">
                {addr.street},<br />
                {addr.city}, {addr.state} — {addr.pincode}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: Final Order Summary Manifest */}
      <h5 className="fw-bold text-secondary small text-uppercase tracking-wider mb-3">
        2. Manifest & Cost Review
      </h5>
      <div className="card p-4 border-0 bg-light rounded-4 mb-4 shadow-sm">
        <div className="border-bottom pb-2 mb-3">
          <h6 className="fw-bold text-dark mb-0">Order Breakdown</h6>
        </div>

        {cart.map((item, index) => (
          <div
            className="d-flex justify-content-between align-items-center mb-3 small text-muted"
            key={item.product?._id || item._id || index}
          >
            <div>
              <span className="fw-bold text-dark">{item.product?.name}</span>
              <span className="badge bg-white border text-dark ms-2">
                x{item.quantity}
              </span>
            </div>
            <span className="fw-bold text-dark">
              ${item.product?.price * item.quantity}
            </span>
          </div>
        ))}

        <hr className="border-secondary my-3" />

        <div className="d-flex justify-content-between mb-2 small text-muted">
          <span>Items Total Subtotal</span>
          <span>${itemsPrice}</span>
        </div>
        <div className="d-flex justify-content-between mb-3 small text-muted">
          <span>Courier Shipping Rate</span>
          <span
            className={
              deliveryCharges === 0 ? "text-success fw-bold" : "text-dark"
            }
          >
            {deliveryCharges === 0 ? "FREE" : `$${deliveryCharges}`}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-dashed fw-bold text-dark fs-5">
          <span>Total Payable Net:</span>
          <span className="text-primary">${finalAmount}</span>
        </div>
      </div>

      {/* Action CTA Button */}
      <button
        className="btn btn-primary w-100 py-3 fw-bold rounded-pill text-uppercase shadow-sm mt-2 tracking-wide"
        onClick={handleCompletePayment}
      >
        💳 Place Order & Settle Payment
      </button>

      <div className="text-center mt-3">
        <Link to="/cart" className="text-decoration-none small text-secondary">
          ← Modify items inside shopping bag
        </Link>
      </div>
    </div>
  );
}
