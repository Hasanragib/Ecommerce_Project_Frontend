import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const {
    user,
    logoutUser,
    orders,
    triggerAlert,
    addresses,
    addAddress,
    loginUser, // ✅ added
  } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ✅ Added - was completely missing
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      triggerAlert("Please enter email and password.");
      return;
    }
    const success = await loginUser(email, password);
    if (success) {
      setEmail("");
      setPassword("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (
      !newAddress.title ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      triggerAlert("Please fulfill all required address fields.");
      return;
    }
    if (!/^\d{6}$/.test(newAddress.pincode)) {
      triggerAlert("Pincode must be exactly 6 digits.");
      return;
    }
    await addAddress(newAddress);
    setNewAddress({
      title: "",
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    });
    setShowForm(false);
  };

  // =========================================================================
  // GATEWAY CHECK
  // =========================================================================
  if (!user) {
    return (
      <div
        className="container my-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="card p-4 shadow-lg border-0 rounded-4 bg-light text-center"
          style={{ maxWidth: "420px", width: "100%" }}
        >
          <div className="display-4 mb-2">🔐</div>
          <h3 className="fw-black text-dark mb-1">Login</h3>
          <p className="text-muted small mb-4">
            Enter details to view dashboards and checkout details.
          </p>
          <form className="text-start" onSubmit={handleLoginSubmit}>
            {" "}
            {/* ✅ added onSubmit */}
            <div className="mb-3">
              <label className="form-label small text-muted fw-bold text-uppercase">
                Email Address
              </label>
              <input
                type="email"
                className="form-control rounded-3 py-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small text-muted fw-bold text-uppercase">
                Security Password
              </label>
              <input
                type="password"
                className="form-control rounded-3 py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 rounded-pill fw-bold text-uppercase shadow-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN PROFILE VIEW
  // =========================================================================
  return (
    <div className="container my-5">
      <div className="row g-5">
        {/* LEFT COLUMN: Identity & Addresses */}
        <div className="col-12 col-lg-4">
          <div className="card p-4 border-0 bg-light rounded-4 text-center mb-4 shadow-sm">
            <div className="display-3 mb-2">👤</div>
            <h4 className="fw-bold text-dark mb-1">{user.name}</h4>
            <span className="badge bg-dark mx-auto mb-3 px-3 py-1 rounded-pill small">
              Verified Profile
            </span>
            <button
              onClick={logoutUser}
              className="btn btn-outline-danger btn-sm rounded-pill fw-bold px-4 mb-3 mx-auto d-block shadow-sm"
            >
              Sign Out
            </button>
            <div className="text-start border-top pt-3 small text-muted">
              <div className="mb-2">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="mb-2">
                <strong>Number:</strong> +91-4556454577
              </div>
              <div>
                <strong>Account Tier:</strong> Premium
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-secondary mb-0 fs-6 text-uppercase">
              Saved Destinations
            </h5>
            <button
              className={`btn btn-sm py-1 px-3 rounded-pill fw-bold small ${showForm ? "btn-secondary" : "btn-outline-primary"}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "➕ Add New"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAddAddressSubmit}
              className="card p-3 border border-light rounded-4 mb-3 shadow-sm bg-white"
            >
              <h6 className="fw-bold text-dark mb-2 small">
                New Address Details
              </h6>
              <input
                type="text"
                name="title"
                placeholder="Title (e.g., Home / Office)"
                className="form-control form-control-sm mb-2"
                value={newAddress.title}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street / Plot No."
                className="form-control form-control-sm mb-2"
                value={newAddress.street}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="area"
                placeholder="Area / Locality (Optional)"
                className="form-control form-control-sm mb-2"
                value={newAddress.area}
                onChange={handleInputChange}
              />
              <div className="row g-2 mb-2">
                <div className="col-5">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="form-control form-control-sm"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-3">
                  <input
                    type="text"
                    name="state"
                    placeholder="ST"
                    className="form-control form-control-sm"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    className="form-control form-control-sm"
                    value={newAddress.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-sm btn-dark w-100 rounded-3 fw-bold"
              >
                Save Address
              </button>
            </form>
          )}

          <div className="d-flex flex-column gap-2">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div
                  className="card p-3 border border-light rounded-4 shadow-sm bg-white"
                  key={String(addr._id)}
                >
                  <h6 className="fw-bold text-dark mb-1 small text-capitalize">
                    {addr.title}
                  </h6>
                  <p className="text-muted small mb-0 lh-base">
                    {addr.street}
                    {addr.area ? `, ${addr.area}` : ""}, {addr.city},{" "}
                    {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center p-3 text-muted small bg-light rounded-4 border">
                No saved addresses found.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Orders */}
        <div className="col-12 col-lg-8">
          <h4 className="fw-bold text-dark mb-4">
            Orders Record ({orders?.length || 0})
          </h4>
          {!orders || orders.length === 0 ? (
            <div className="card border-0 bg-light p-5 rounded-4 text-center text-muted shadow-sm">
              <span className="fs-1 mb-2">📦</span>
              <h5 className="fw-bold text-dark mb-1">No History.</h5>
              <p className="text-secondary small mb-3">
                You haven't placed any orders yet.
              </p>
              <Link
                to="/products"
                className="btn btn-sm btn-dark px-4 rounded-pill text-decoration-none mx-auto"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {orders.map((ord, idx) => (
                <div
                  className="card border-0 bg-light p-4 rounded-4 shadow-sm position-relative overflow-hidden"
                  key={ord.id || idx}
                >
                  <div
                    className="position-absolute top-0 start-0 h-100 bg-success"
                    style={{ width: "4px" }}
                  ></div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-2 mb-3 gap-2">
                    <div>
                      <span className="text-muted small">
                        Transaction Stamp:{" "}
                      </span>
                      <strong className="text-dark small">
                        {ord.date || new Date().toLocaleDateString()}
                      </strong>
                    </div>
                    <span className="badge bg-success-subtle text-success py-1 px-3 rounded-pill border border-success-subtle text-uppercase small">
                      Status: Dispatched
                    </span>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-bold text-secondary small text-uppercase mb-2">
                      Item Breakdown
                    </h6>
                    {ord.items?.map((item, itemIdx) => (
                      <div
                        className="d-flex justify-content-between align-items-center mb-1 small text-muted"
                        key={item.product?._id || itemIdx}
                      >
                        <span>
                          • {item.product?.name}{" "}
                          <strong className="text-dark">
                            x{item.quantity}
                          </strong>
                        </span>
                        <span className="fw-bold text-dark">
                          ${item.product?.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end pt-3 border-top gap-2 small">
                    <div>
                      <span
                        className="text-muted text-uppercase"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Delivery Destination
                      </span>
                      <p
                        className="mb-0 text-dark fw-semibold text-truncate"
                        style={{ maxWidth: "340px" }}
                      >
                        {ord.deliveryTarget?.street}, {ord.deliveryTarget?.city}
                      </p>
                    </div>
                    <div className="text-sm-end">
                      <span className="text-muted small">Total Paid</span>
                      <h5 className="fw-bold text-primary mb-0">
                        ${ord.totalPaid}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
