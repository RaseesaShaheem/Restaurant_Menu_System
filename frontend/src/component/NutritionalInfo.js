import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  useNavigate, useParams } from 'react-router-dom';
// import { Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2'; // Import Doughnut 
import {Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './NutritionalInfo.css';
// Register the necessary components
Chart.register(ArcElement, Tooltip, Legend);
const NutritionalInfo = () => {
    const { id } = useParams(); // Get menu item ID from the URL
    const navigate = useNavigate();
    const [menuItem, setMenuItem] = useState(null);
   // const [quantity, setQuantity] = useState(100); // Default to 100g
   const [quantityMultiplier, setQuantityMultiplier] = useState(1); // Default to 1 serving

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/menu-items/${id}/`)
            .then(response => setMenuItem(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!menuItem) return <div>Loading...</div>;

    const calculateNutritionalValues = () => {
        if (!menuItem.ingredients || !Array.isArray(menuItem.ingredients)) {
            return {
                calories: 0,
                protein: 0,
                fat: 0,
                carbohydrates: 0,
                sugar: 0,
                calcium: 0,
                iron: 0,
                fiber: 0,
            };
        }

        const totalNutrients = {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            sugar: 0,
            calcium: 0,
            iron: 0,
            fiber: 0,
        };

        menuItem.ingredients.forEach(ingredient => {
            if (ingredient.nutritional_info) {
                // const ratio = (ingredient.quantity / 100) * (quantity / (menuItem.standard_quantity ));
                const ratio = (ingredient.quantity / 100) * quantityMultiplier;
                totalNutrients.calories += (ingredient.nutritional_info.calories || 0) * ratio;
                totalNutrients.protein += (ingredient.nutritional_info.protein || 0) * ratio;
                totalNutrients.fat += (ingredient.nutritional_info.fat || 0) * ratio;
                totalNutrients.carbohydrates += (ingredient.nutritional_info.carbohydrates || 0) * ratio;
                totalNutrients.sugar += (ingredient.nutritional_info.sugar || 0) * ratio;
                totalNutrients.calcium += (ingredient.nutritional_info.calcium || 0) * ratio;
                totalNutrients.iron += (ingredient.nutritional_info.iron || 0) * ratio;
                totalNutrients.fiber += (ingredient.nutritional_info.fiber || 0) * ratio;
            }
        });

        return totalNutrients;
    };

    const nutrients = calculateNutritionalValues();

    console.log("Calculated Nutrients:", nutrients);
    const pieData = {
        labels: ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Sugar', 'Calcium', 'Iron', 'Fiber'],
        datasets: [
            {
                data: [
                    nutrients.calories,
                    nutrients.protein,
                    nutrients.fat,
                    nutrients.carbohydrates,
                    nutrients.sugar,
                    nutrients.calcium,
                    nutrients.iron,
                    nutrients.fiber,
                ],
                backgroundColor: [
                    // '#FFD700',
                    // '#6495ED',
                    // '#FF6347',
                    // '#32CD32',
                    // '#9370DB',
                    // '#00CED1',
                    // '#FF69B4',
                    // '#A9A9A9',
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#C9CBCF',
                    '#8AC926',

                ],
            },
        ],
    };
    const options={
        plugins:{
            legend:{
                labels:{
                    color:'#fff',
                    font:{
                        size:14
                    }
                }
            }
        }
    }
    
    return (
        <div className='con'>
            <h1>{menuItem.name}</h1>
            <p>{menuItem.description}</p>
         <div className='nutri-info-container'>
            
                 <label>
                Quantity (Multiples of Serving Size):
                <input
                    type="number"
                    value={quantityMultiplier}
                    min="1"
                    onChange={(e) => setQuantityMultiplier(Number(e.target.value))}
                />
            </label>
            <div className='piechart-container'>
            <Doughnut data={pieData} options={options}/>
             {/* <Pie data={pieData} />  */}
             </div>
             {/* <div className='legend-container'>
            {pieData.labels.map((label,index) =>
            (
                    <div key={index} 
                    className='legend-item'>
                        <div className='legend-colorbox'
                        style={{backgroundcolor:pieData.datasets[0].backgroundColor[index]}}>
                             </div>
                             <span className='legend-label'>{label}</span>
                             </div>
                ))}
                */}

         {/* </div> */}
       </div>
            <div className='nutri-details'>
                <h3>Your Intake...</h3>
                <p>Calories: {nutrients.calories.toFixed(2)} kcal</p>
                <p>Protein: {nutrients.protein.toFixed(2)} g</p>
                <p>Fat: {nutrients.fat.toFixed(2)} g</p>
                <p>Carbohydrates: {nutrients.carbohydrates.toFixed(2)} g</p>
                <p>Sugar: {nutrients.sugar.toFixed(2)} g</p>
                <p>Calcium: {nutrients.calcium.toFixed(2)} g</p>
                <p>Iron: {nutrients.iron.toFixed(2)} g</p>
                <p>Fiber: {nutrients.fiber.toFixed(2)} g</p>
            </div>
         
            <button className='back-button' onClick={()=>navigate(-1)}>Back</button>   

        </div>
    );
};

export default NutritionalInfo;

