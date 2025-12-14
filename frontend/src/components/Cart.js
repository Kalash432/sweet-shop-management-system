function Cart({ cart, setCart }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="cart">
      <h2>🛒 Cart</h2>

      {cart.map(item => (
        <div key={item._id}>
          {item.name} × {item.qty} = ₹{item.price * item.qty}
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      {cart.length > 0 && (
        <button onClick={() => alert("🎉 Order Placed Successfully!")}>
          Checkout
        </button>
      )}
    </div>
  );
}

export default Cart;
