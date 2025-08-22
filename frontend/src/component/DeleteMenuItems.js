import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { Select, Button, notification } from "antd";
import './DeleteMenuItems.css'
import NavBar from '../pages/NavBar';
// const { Option } = Select;

const DeleteMenuItems = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [message, setMessage] = useState("");


    const navigate = useNavigate();


    // Fetch menu items from the API
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/menu-items/') 
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching menu items:", error);
            });
    }, []);

    // Handle delete action
    const handleDelete = () => {
        if (selectedItems.length === 0) {
            setMessage("Please select at least one item to delete.");
            return;
        }

        axios.post("http://127.0.0.1:8000/api/menu-items/delete/", 
        { ids: selectedItems

         } )
            .then(() => {
                setMessage("Selected menu items deleted successfully!");
                setMenuItems(menuItems.filter(item => !selectedItems.includes(item.id))); // Remove deleted items from state
                setSelectedItems([]); // Clear selection
            })
            .catch(error => {
                console.error("Error deleting menu items:", error);
                setMessage("Failed to delete menu items.");
            });
    };
    
     // Navigate back to Staff Dashboard
     const handleBack = () => {
        navigate('/staff-dashboard'); // Change this route to your Staff Dashboard route
    };

    return (
        <div className="delete-menu-container">
             <NavBar />
        <h2 className="delete-menu-title">DELETE MENU ITEMS</h2>
        {message && (
                <p className="text-sm text-center text-red-600 mb-2">{message}</p>
            )}
          {/* Multi-select dropdown */}
          <select
                multiple
                className="delete-menu-select"
                value={selectedItems}
                onChange={(e) =>
                    setSelectedItems(Array.from(e.target.selectedOptions, option => option.value))
                }
            >
                {menuItems.map(item => (
                    <option key={item.id} value={item.id} className="delete-menu-option">
                        {item.name}
                    </option>
                ))}
            </select>
       
        <button
                className="delete-menu-button"
                onClick={handleDelete}
            >
                DELETE SELECTED ITEMS
            </button>

             {/* Navigation button */}
             <button className="back-button" onClick={handleBack}>
                Back to Staff Dashboard
            </button>

    </div>
    
    );
};

export default DeleteMenuItems;
