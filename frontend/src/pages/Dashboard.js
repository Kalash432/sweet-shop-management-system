import { useEffect, useState } from "react";
import "../Dashboard.css";

function Dashboard({ token, onLogout }) {
  const [sweets, setSweets] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [popup, setPopup] = useState("");
  const [editingSweet, setEditingSweet] = useState(null);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // ADMIN FORM STATES
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);

  /* ---------- POPUP ---------- */
  const showPopupMsg = (msg) => {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2500);
  };

  /* ---------- FETCH ---------- */
  const fetchSweets = async () => {
    const res = await fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSweets(await res.json());
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  /* ---------- CART ---------- */
  const addToCart = (sweet) => {
    const found = cart.find((i) => i._id === sweet._id);
    if (found) {
      setCart(
        cart.map((i) =>
          i._id === sweet._id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...sweet, qty: 1 }]);
    }
  };

  const incQty = (id) =>
    setCart(
      cart.map((i) =>
        i._id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );

  const decQty = (id) =>
    setCart(
      cart
        .map((i) =>
          i._id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = async () => {
    for (let item of cart) {
      for (let i = 0; i < item.qty; i++) {
        await fetch(
          `http://localhost:5000/api/sweets/${item._id}/purchase`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    }
    setCart([]);
    fetchSweets();
    showPopupMsg("🎉 Order placed successfully");
  };

  /* ---------- ADMIN ---------- */
  const startEdit = (sweet) => {
    if (!isAdmin) {
      showPopupMsg("❌ Admin access only");
      return;
    }

    setShowAdmin(true);
    setEditingSweet(sweet);
    setName(sweet.name);
    setCategory(sweet.category);
    setPrice(sweet.price);
    setQuantity(sweet.quantity);
    setImage(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addOrUpdateSweet = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("category", category);
    fd.append("price", price);
    fd.append("quantity", quantity);
    if (image) fd.append("image", image);

    const url = editingSweet
      ? `http://localhost:5000/api/sweets/${editingSweet._id}`
      : "http://localhost:5000/api/sweets";

    const method = editingSweet ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (res.ok) {
      showPopupMsg(
        editingSweet ? "✏️ Product updated" : "✅ Product added"
      );
      setName("");
      setCategory("");
      setPrice("");
      setQuantity("");
      setImage(null);
      setEditingSweet(null);
      fetchSweets();
    } else {
      showPopupMsg("❌ Operation failed");
    }
  };

  const deleteSweet = async (id) => {
    if (!isAdmin) {
      showPopupMsg("❌ Admin access only");
      return;
    }

    await fetch(`http://localhost:5000/api/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSweets();
    showPopupMsg("🗑 Product deleted");
  };

  /* ---------- UI ---------- */
  return (
    <div className="shop-container">
      {popup && <div className="popup">{popup}</div>}

      <header className="shop-header">
        <h2>🍬 Sweet Shop</h2>
        <div>
          <button onClick={() => setShowAdmin(!showAdmin)}>Admin</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      {showAdmin && (
        <div className="admin-panel">
          {isAdmin ? (
            <>
              <h3>{editingSweet ? "Update Product" : "Add Product"}</h3>
              <form onSubmit={addOrUpdateSweet}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button>{editingSweet ? "Update" : "Add"} Product</button>
              </form>
            </>
          ) : (
            <p>❌ You are not an admin</p>
          )}
        </div>
      )}

      <input
        className="search-box"
        placeholder="Search sweets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="shop-body">
        {/* SWEETS */}
        <div className="sweets-grid">
          {sweets
            .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
            .map((sweet) => (
              <div key={sweet._id} className="sweet-card">
                <img src={`http://localhost:5000${sweet.image}`} alt={sweet.name} />
                <h4>{sweet.name}</h4>
                <p>₹{sweet.price}</p>

                <button disabled={sweet.quantity === 0} onClick={() => addToCart(sweet)}>
                  {sweet.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                {isAdmin && (
                  <>
                    <button onClick={() => startEdit(sweet)}>Update</button>
                    <button className="delete-btn" onClick={() => deleteSweet(sweet._id)}>Delete</button>
                  </>
                )}
              </div>
            ))}
        </div>

        {/* BILLING (FIXED ALIGNMENT) */}
        <div className="cart-section">
          <h3>🧾 Billing</h3>

          {cart.length === 0 && <p>No items selected</p>}

          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-left">
                <div className="cart-name">{item.name}</div>
                <div className="qty-controls">
                  <button onClick={() => decQty(item._id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => incQty(item._id)}>+</button>
                </div>
              </div>

              <div className="cart-right">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}

          <h4>Total: ₹{total}</h4>
          <button disabled={!cart.length} onClick={placeOrder}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
