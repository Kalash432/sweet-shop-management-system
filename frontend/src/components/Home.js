import { useEffect, useState } from "react";

function Home({ token }) {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sweets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setSweets(data));
  }, [token]);

  const handleBuy = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/sweets/${id}/purchase`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const updated = await res.json();
      setSweets(sweets.map(s =>
        s._id === id ? updated : s
      ));
    }
  };

  return (
    <div className="home">
      <h2>🍭 Available Sweets</h2>

      <div className="grid">
        {sweets.map(sweet => (
          <div className="card" key={sweet._id}>
            <img
              src={`http://localhost:5000${sweet.image}`}
              alt={sweet.name}
            />

            <h3>{sweet.name}</h3>
            <p>₹ {sweet.price}</p>
            <p>Qty: {sweet.quantity}</p>

            <button
              disabled={sweet.quantity === 0}
              onClick={() => handleBuy(sweet._id)}
            >
              {sweet.quantity === 0 ? "Out of Stock" : "Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
