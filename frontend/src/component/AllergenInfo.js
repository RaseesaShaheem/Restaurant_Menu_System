import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AllergenInfo.css';
const AllergenInfo = () => {
    const { id } = useParams(); // Get menu item ID from the URL
    const [allergenMessage, setAllergenMessage] = useState('');
    const [allergens, setAllergens] = useState([]);
    const [menuItem, setMenuItem] = useState(null);
    const navigate=useNavigate();
    
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/api/menu-items/${id}/`)
                .then(response => {
                    setMenuItem(response.data);
                    if (response.data.allergens && response.data.allergens.length > 0) {
                        setAllergens(response.data.allergens);
                        setAllergenMessage('Warning: This item contains allergens!');
                    } else {
                        setAllergenMessage('No allergens found.');
                        setAllergens([]);
                    }
                })
                .catch(error => {
                    console.error(error);
                    setAllergenMessage('Error fetching allergen information.');
                });
        }
    }, [id]);

return (
    <div className='allergen-info-container'>
        <h1>Allergen Information</h1>
        {menuItem && (
            <div>
                <h2>{menuItem.name}</h2>
                <p>{menuItem.description}</p>
            </div>
        )}
        {allergenMessage && (
            <div className='allergen-message'>
                 <h3>{allergenMessage}</h3>
                 </div>
                ) }
        {console.log("Allergens data:", allergens)}  
       
       

{allergens && allergens.length > 0 ? (
    <div className='allergen-warnings'>
        <h3>Allergen Warnings:</h3>
        <ul>
            {allergens.map((allergen, index) => (
                <li key={index}>{allergen}</li>  // Ensure correct field name
            ))}
           
        </ul>
    </div>
) : (
    <p>No allergens found for this menu item.</p>  // Add fallback text for debugging
)}
                                 <button className='back-button' onClick={()=>navigate(-1)}>Back</button>
                             </div>
                        );

                     };
                     
export default AllergenInfo;