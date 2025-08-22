import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MenuComponent.css'; // Add your styling here

import SearchBar from './SearchBar'; 
import NavBar from '../pages/NavBar';
import Footer from '../pages/Footer';
const MenuComponent = () => {
  const [categorizedItems, setCategorizedItems] = useState({
    starter: [],
    maincourse: [],
    drinks: [],
    desserts: []
  });
  const [searchTerm, setSearchTerm] = useState("");
    
  const navigate = useNavigate();


  useEffect(() => {
    // axios.get('http://localhost:8000/api/menu-items/') // Adjust URL if needed
    axios.get('http://127.0.0.1:8000/api/menu-items/') 
    .then(response => {
        console.log('API Response:', response.data);

        // Categorize the items
        const categorized = {
          starter: [],
          maincourse: [],
          drinks: [],
          desserts: []
        };

       
        response.data.forEach(item => {
          const categoryName = item.category_details.name.toLowerCase();
          switch (categoryName) {
            case 'starter':
              categorized.starter.push(item);
              break;
            case 'main course': // Adjusted to account for "Main Course"
            //case 'maincourse':
              categorized.maincourse.push(item);
              break;
            case 'drinks':
              categorized.drinks.push(item);
              break;
            case 'desserts':
              categorized.desserts.push(item);
              break;
            default:
              break;
          }
        });
        setCategorizedItems(categorized);
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
      });
  }, []);

// Function to handle navigation to the details page for a selected menu item
  const handleItemClick = (id) => {
    navigate(`/menu-item/${id}`);
  };
 // Function to filter items based on search term
 const filterItems = (items) => {
  return items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

  
  return (
     <div className="menu">
      <NavBar/>
         <h2 className="heading">BRISTO FOODS</h2>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      

      {/* Starter Category */}
      <div className="menu-category">
        <h2>Starter</h2>
        <div className="menu-grid">
          {filterItems(categorizedItems.starter).map(item => (
            <div key={item.id} className="menu-item"
             onClick={() => handleItemClick(item.id)}>
              <img
                src={`${item.image}`}
                alt={item.name}
                className="menu-item-image"
                onError={(e) => e.target.style.display = 'none'} // Hide if image not found
              />
              <div className="des">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: {item.price} -/</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Course Category */}
      <div className="menu-category">
        <h2>Main Course</h2>
        <div className="menu-grid">
          {filterItems(categorizedItems.maincourse).map(item => (
            <div key={item.id} className="menu-item"
             onClick={() => handleItemClick(item.id)}>
              <img
                src={`${item.image}`}
                alt={item.name}
                className="menu-item-image"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: {item.price} -/</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drinks Category */}
      <div className="menu-category">
        <h2>Drinks</h2>
        <div className="menu-grid">
          {filterItems(categorizedItems.drinks).map(item => (
            <div key={item.id} className="menu-item"
             onClick={() => handleItemClick(item.id)}>
              <img
                src={`${item.image}`}
                alt={item.name}
                className="menu-item-image"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: {item.price} -/</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desserts Category */}
      <div className="menu-category">
        <h2>Desserts</h2>
        <div className="menu-grid">
          {filterItems(categorizedItems.desserts).map(item => (
            <div key={item.id} className="menu-item"
             onClick={() => handleItemClick(item.id)}>
              <img
                src={`${item.image}`}
                alt={item.name}
                className="menu-item-image"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: {item.price} -/</p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
    
  );
  
};

export default MenuComponent;