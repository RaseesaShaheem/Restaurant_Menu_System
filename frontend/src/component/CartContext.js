import React, { createContext, useState, useContext,useEffect } from 'react';
import axios from 'axios';
// Create the context
const CartContext = createContext();

// Provider component to wrap the app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Retrieve cart from localStorage (or initialize as empty)
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
 // Add item to cart (update quantity if it exists)
 const addToCart = (menuItem, quantity) => {
  setCart((prevCart) => {
    const existingItemIndex = prevCart.findIndex((item) => item.id === menuItem.id);

    if (existingItemIndex !== -1) {
      // If item exists, update quantity
      const updatedCart = [...prevCart];
      // const currentQty = Number(updatedCart[existingItemIndex].quantity) || 0;
      updatedCart[existingItemIndex].quantity = Number(updatedCart[existingItemIndex].quantity || 0) + Number(quantity);
      return updatedCart;
      // updatedCart[existingItemIndex].quantity += quantity;
      
    } else {
      // If item is new, add it
      return [...prevCart, { ...menuItem, quantity:Number(quantity)  }];
    }
  });

  // Show an alert message to the user
  alert(`${menuItem.name} added to cart!`);


  // Optionally, make the API call to persist the item in the backend.
  // You need to supply the current token and any other necessary data.
  const token = localStorage.getItem('token') || '';
  axios.post("http://127.0.0.1:8000/api/cart/", {
    token,
    customer_name: "Your Customer Name", // You might need to get this from user data
    menu_item_id: menuItem.id,
    quantity
    
  })
  .then(response => {
    console.log("Item added to backend cart", response.data);
    // Optionally update token if the API returns one, etc.
  })
  .catch(error => {
    console.error("Error adding item to backend cart", error);
  });
};



 // Clear cart after placing an order
 const clearCart = () => {
  setCart([]);
  localStorage.removeItem('cart'); // Remove from localStorage
};

 // Save cart to localStorage whenever it changes
 useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart,addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);


//This keeps the cart persistent across pages and allows adding multiple items.