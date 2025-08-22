import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddMenuItem.css";

const AddMenuItem = () => {
  const navigate = useNavigate();

  // State for menu item
  const [menuItem, setMenuItem] = useState({
    name: "",
    category: "",
    price: "",
    image: null,
    description: "",
    standard_quantity: "",
  });

  // State for ingredients
  const [ingredients, setIngredients] = useState([]);

  // State for nutritional values
  const [nutritionalValues, setNutritionalValues] = useState({});

  // State for allergens
  const [allergens, setAllergens] = useState([]);

  // State for categories
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleMenuItemChange = (e) => {
    const { name, value } = e.target;
    setMenuItem({ ...menuItem, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setMenuItem({ ...menuItem, image: e.target.files[0] });
  };

  // Handle ingredient addition
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  // Handle ingredient change
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][name] = value;
    // Ensure nutritional values exist for the ingredient
  setNutritionalValues((prev) => ({
    ...prev,
    [value]: prev[updatedIngredients[index].name] || {  // Preserve existing values if name changes
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sugar: 0,
      calcium: 0,
      iron: 0,
      fiber: 0
    }
  }));
    setIngredients(updatedIngredients);
  };
  // Handle nutritional values change
  const handleNutritionalChange = (index, field, value) => {
    const ingredientName = ingredients[index].name;
    if (!ingredientName) return; // Prevent errors if name is empty

    setNutritionalValues((prev) => ({
      ...prev,
      [ingredientName]: { ...prev[ingredientName],[field]: parseFloat(value) || 0 }, // Ensure numeric values 
    }));
  };

  // Handle allergens input
  const handleAllergenChange = (e) => {
    setAllergens(e.target.value.split(",").map((item) => item.trim()));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    Object.keys(menuItem).forEach((key) => formData.append(key, menuItem[key]));
 
    //  POST menu item
    const menuItemResponse = await axios.post("http://127.0.0.1:8000/api/menu-items/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const menuItemId = menuItemResponse.data.id;
 
    console.log(`Created Menu Item ID: ${menuItemId}`);
 
    for (const ingredient of ingredients) {
      //  POST ingredient
      const ingredientResponse = await axios.post("http://127.0.0.1:8000/api/ingredients/", { 
        name: ingredient.name,
        quantity: parseFloat(ingredient.quantity),
        menu_item: menuItemId,
      });
 
      console.log("Ingredient API Response:", ingredientResponse.data);
      // const ingredientId = ingredientResponse.data.id;
      const ingredientId = Array.isArray(ingredientResponse.data) 
          ? ingredientResponse.data[0]?.id  // If it's an array, get first element's ID
          : ingredientResponse.data.id;     // If it's an object, get ID directly
 
      if (!ingredientId) {
        console.error("Error: Ingredient ID is missing!");
        return;
      }
 
      console.log(`Sending nutritional info for ingredient ID: ${ingredientId}`);
 
      // Ensure Correct Field Names for Nutritional Info
      const nutritionalData = {
        ingredient: ingredientId,
        calories: nutritionalValues[ingredient.name]?.calories || 0,
        protein: nutritionalValues[ingredient.name]?.protein || 0,
        fat: nutritionalValues[ingredient.name]?.fat || 0,
        carbohydrates: nutritionalValues[ingredient.name]?.carbohydrates || 0,  // ✅ FIXED FIELD NAME
        sugar: nutritionalValues[ingredient.name]?.sugar || 0,
        calcium: nutritionalValues[ingredient.name]?.calcium || 0,
        iron: nutritionalValues[ingredient.name]?.iron || 0,
        fiber: nutritionalValues[ingredient.name]?.fiber || 0,
      };
      console.log(`Nutritional Info Payload for ${ingredient.name}:`, nutritionalData);

      //  POST nutritional info
      await axios.post(`http://127.0.0.1:8000/api/ingredients/${ingredientId}/nutritional-info/`,nutritionalData) 
     
      .then(response => {
        console.log(`Nutritional info added for ${ingredient.name}:`, response.data);
      })
      .catch(error => {
        console.error(`Error inserting nutritional info for ${ingredient.name}:`, 
          error.response ? error.response.data : error.message);
      });
    }
 
      await axios.post(`http://127.0.0.1:8000/api/menu-items/${menuItemId}/allergens/`, {
        menu_item: menuItemId,
        allergens,
      });

      alert("Menu Item, Ingredients, Nutritional Info, and Allergens added successfully!");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("Failed to add menu item or related data.");
    }
  };


return (
    <div className="add-menu-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Add New Menu Item</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleMenuItemChange} required />
        <select value={menuItem.category} onChange={handleMenuItemChange} name="category" required>
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <input type="number" name="price" placeholder="Price" onChange={handleMenuItemChange} required />
        <input type="file" name="image" onChange={handleFileChange} required />
        <textarea name="description" placeholder="Description" onChange={handleMenuItemChange} required />
        <input type="number" name="standard_quantity" placeholder="Standard Quantity" onChange={handleMenuItemChange} required />
        <h3>Ingredients</h3>
        {ingredients.map((ingredient, index) => (
       
        <div key={index}>
           <input type="text" name="name" placeholder="Ingredient Name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} required />
             <input type="number" name="quantity" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, e)} required />
             {Object.keys(nutritionalValues[ingredient.name] || {}).map((field) => (
  <input
    key={field}
    type="number"
    placeholder={field}  // This will now be visible
    step="0.0001"
    defaultValue={nutritionalValues[ingredient.name]?.[field] || ""}
    onChange={(e) => handleNutritionalChange(index, field, e.target.value)}
    required
  />
))}
</div>
        ))}
        <button type="button" onClick={addIngredient}>Add Ingredient</button>
        <h3>Allergens</h3>
        <input type="text" placeholder="Allergens (comma-separated)" onChange={handleAllergenChange} />
        <button type="submit">Submit</button>
      </form>
      <button className='back-button' onClick={()=>navigate("/menu")}>Back to Menu</button>
      <button className='back-button' onClick={()=>navigate(-1)}>Back</button>
      
    </div>
  );
};


export default AddMenuItem;