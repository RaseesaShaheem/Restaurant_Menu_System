import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuItemDetails.css'; // Add styling
import { useCart } from '../component/CartContext';
// import { useHistory } from 'react-router-dom';

const MenuItemDetails = ({InitialMenuItem}) => {
  const { id } = useParams(); // Get menu item ID from the URL
  const navigate = useNavigate();
  // const [cart, setCart] = useState([]);
  // const history = useHistory();
  const [menuItem, setMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

 // Use global addToCart from context
 const { addToCart } = useCart();

  useEffect(() => {
    // On component mount, fetch the existing cart from localStorage
    // const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // setCart(storedCart);

    // Fetch the selected menu item details
    axios.get(`http://127.0.0.1:8000/api/menu-items/${id}/`) 
      .then(response => {
        setMenuItem(response.data);
        setTotalPrice(response.data.price); // Initialize total price
      })
      .catch((error) => {
        console.error('Error fetching menu item details:', error);
      });
    },[id]);
  

  // Update total price based on quantity
  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    setQuantity(qty);
    // setTotalPrice(qty * menuItem.price);
    setTotalPrice(qty * (menuItem ? menuItem.price : 0));
  }
  const handleAllergyCheck = () => {
    // Navigate to allergy check interface
    navigate(`/allergy-check/${id}`);
  };

  const handleNutritionalInfo = () => {
    // Navigate to nutritional information interface
    navigate(`/nutritional-info/${id}`);
  };
  


  // // Function to add an item to the cart
  // const addToCart = (Item) => {
  //   // Check if there's a cart in localStorage, if not initialize an empty cart
  //   const updatedCart = [...cart, Item];
    
  //   // Save the updated cart in localStorage
  //   localStorage.setItem('cart', JSON.stringify(updatedCart));

  //   // Update the state to reflect changes
  //   setCart(updatedCart);

  //   // Show a popup alert
  //   alert(`${menuItem.name} added to cart!`);
  // };

  const viewCart = () => {
    navigate('/cart');
  };
 

  if (!menuItem) return <p>Loading menu item details...</p>;


  return (
    <div className="menu-item-details">
    
      <h2>{menuItem.name}</h2>
      <p><strong>Category:</strong> {menuItem.category_details.name}</p>
      <p><strong>Description:</strong> {menuItem.description}</p>
      <p><strong>Price:</strong> {menuItem.price} -/ per unit</p>

      <div className="quantity-section">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          onChange={handleQuantityChange}
        />
        <p><strong>Total Price:</strong> {totalPrice} -/</p>
      </div>

      <div className="action-buttons">
         {/* Use the global addToCart function from context */}
         <button onClick={(e) => { e.stopPropagation(); addToCart( menuItem,1 ); }}>Add to Cart</button>
         {/* <button onClick={() => addToCart(menuItem, quantity )}>Add to Cart</button>   */}

        {/* <button onClick={() => addToCart({ ...menuItem, quantity })}>Add to Cart</button>   */}
        <button onClick={() => navigate("/menu")}>Back to Menu</button>
        <button onClick={handleAllergyCheck}>Allergy Check</button>
        <button onClick={handleNutritionalInfo}>Nutritional Info</button>
        <button onClick={viewCart}>View Cart</button>
      </div>
    </div>
    
  );
};

export default MenuItemDetails;












