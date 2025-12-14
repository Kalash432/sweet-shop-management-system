import { useState } from "react";
import "../Admin.css"; // create & style as you wish

// props: token (JWT) and optionally a logout callback
function Admin({ token, onLogout }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(""); // feedback message

  const handleAddSweet = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setStatus("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("image", imageFile); // backend expects field name "image"

    try {
      const res = await fetch("http://localhost:5000/api/sweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // still need auth header
          // do NOT set Content-Type here; browser sets multipart boundary
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Sweet added successfully!");
        // reset form
        setName("");
        setCategory("");
        setPrice("");
        setQuantity("");
        setImageFile(null);
      } else {
        setStatus(data.message || "Failed to add sweet.");
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2>Admin: Add New Sweet</h2>
        <button onClick={onLogout}>Logout</button>
      </header>

      <form className="admin-form" onSubmit={handleAddSweet}>
        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-row">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-row">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            required
          />
        </div>

        <button type="submit" className="add-btn">
          Add Sweet
        </button>

        {status && <p className="status-msg">{status}</p>}
      </form>
    </div>
  );
}

export default Admin;
