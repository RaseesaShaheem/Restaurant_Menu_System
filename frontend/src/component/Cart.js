




import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const { cart, setCart,clearCart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  // const [thankYouMessage, setThankYouMessage] = useState(false); // ✅ New state for Thank You message
  const navigate = useNavigate();

 // Fetch the cart contents from the backend when the token is available
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return; // Exit if no token exists yet
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/cart/view/${token}/`);
        // Assuming the API response contains { cart_items: [...], total_price: ... }
        if (response.data.cart_items) {
          setCart(response.data.cart_items);
          // Optionally, you could also update the total price directly from the response
          // setTotalPrice(response.data.total_price);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [token, setCart]);

   // Calculate the total price whenever the cart changes
  useEffect(() => {
    // Calculate total price when cart changes
    console.log("Current cart:", cart);
    const total = cart.reduce((acc, item) => {
      console.log("Item price:", item.price, "Item quantity:", item.quantity);
      let price = parseFloat(item.price);
      let qty = Number(item.quantity);
      if (isNaN(price)) {
        console.warn("Price is NaN for item:", item);
        price = 0;
      }
      if (isNaN(qty)) {
        console.warn("Quantity is NaN for item:", item);
        qty = 0;
      }
      return acc + price * qty;
    }, 0);
    // const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  useEffect(() => {
    let storedToken = localStorage.getItem('token') || '';
    if (storedToken) {
      storedToken = Number(storedToken); // Convert to number
      if (isNaN(storedToken)) {
        console.warn("Token is not a valid number, resetting...");
        storedToken = null; // Handle invalid cases
      }
    }
    console.log("Stored token:", storedToken);
    console.log("Type of token:", typeof storedToken); // Will log "string" or "number"
    setToken(storedToken);
  }, []);
  

  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart); // update cart state
    // localStorage.setItem('cart', JSON.stringify(updatedCart)); // update localStorage
    setTotalPrice(updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0));
  };


  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name before placing the order.");
      return;
    }

    try {
      let currentToken = token;

      // Generate a new token if one doesn't exist
      if (!currentToken) {
        const response = await axios.get("http://127.0.0.1:8000/api/token/generate/");
        currentToken = response.data.token;
        setToken(currentToken);
        localStorage.setItem("token",currentToken);
      }
      if (!currentToken) {
        alert("Token not found.");
        return;
      }

      // Send the cart data to the backend
      const orderResponse = await axios.post(`http://127.0.0.1:8000/api/order/place/${currentToken}/`,{ customer_name: customerName, cart}
      );

      
      // Update token with the new token from the response
      setToken(orderResponse.data.token);
      localStorage.setItem("token", orderResponse.data.token);
      clearCart();
      setCustomerName(''); // ✅ Clears the input field after order is placed

      // setThankYouMessage(true); // ✅ Show Thank You message
      // setTimeout(() => setThankYouMessage(false), 5000);
      

      // Display success message and redirect
      alert(`Order placed successfully!`);
      clearCart();
      // navigate("/orders");

      // // Notify the staff dashboard (via WebSocket or API call)
      // await axios.post("http://127.0.0.1:8000/api/notify-staff/", {
      //   token: token,
      //   cart,
      // });

    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("There was an error placing your order.");
    }
  };
  const handleBack = () => {
    navigate('/menu'); // Change this route to your Staff Dashboard route
};

  
  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
       {/* ✅ Show Thank You Message */}
       {/* {thankYouMessage && (
        <div className="thank-you-message">
          🎉 Thank You for Ordering! Your order has been placed successfully.
        </div>
      )} */}
      {cart.length === 0 ? (
        <p className="empty-cart-message">No items in the cart.</p>
      ) : (
        <ul className="cart-items-list">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">

            <span className="item-name">{item.name}</span> <span className="item-quantity">x {item.quantity}</span>
            <span className="item-price">= ${parseFloat(item.price) * Number(item.quantity)}</span>
              <button 
              className="remove-item-button"
              onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}


      <h3  className="total-price">Total Price: ${totalPrice}</h3>
      {/* ✅ Display the Token */}
    {token && <h3 className="order-token">Order Token: {token}</h3>} 
  {/* ✅ Input for Customer Name */}
  <label className="customer-name-label">Enter Your Name:</label>
      <input 
        type="text" 
        className="customer-name-input" 
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Your Name"
      />
      <button 
       className="place-order-button"
      onClick={handlePlaceOrder} disabled={cart.length === 0}>
        Place Order
      </button>
      <button className="back-button" onClick={handleBack}>
                Back 
            </button>
    </div>
  );
};

export default Cart;
