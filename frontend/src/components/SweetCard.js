function SweetCard({ sweet, onAdd }) {
  return (
    <div className="sweet-card">
      <img
        src={`/images/${sweet.name}.jpg`}
        alt={sweet.name}
      />
      <h3>{sweet.name}</h3>
      <p>₹{sweet.price}</p>
      <button onClick={onAdd} disabled={sweet.quantity === 0}>
        {sweet.quantity === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default SweetCard;
