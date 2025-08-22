// OrderDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../pages/NavBar';
import { useNavigate } from "react-router-dom";
import './OrderDetails.css'

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Navigation hook
  // const [currentOrder, setCurrentOrder] = useState(null);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/orders/today/");
      // Sort orders by 'created_at' in descending order (latest first)
      console.log("API Response:", response.data); // ✅ Debugging

    // const sortedOrders = response.data.orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const sortedOrders = response.data.orders.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }


    
  };
  useEffect(() => {
    console.log("🖥️ Rendered UI Orders:", orders);
}, [orders]);

  useEffect(() => {
    console.log("📦 Orders updated:", orders);
}, [orders]);


const updateStatus = async (token, newStatus) => {
  if (!token) {
      console.error("❌ Error: Token is missing.");
      return;
  }


   // 🔴 Prevent clicking the same status again
   const currentOrder = orders.find(order => order.token === token);
   


   // 🛑 Prevent "Completed" without "Progress"
   if (newStatus === "completed" && (!currentOrder.status || currentOrder.status !== "progress")) {
    alert("⚠️ You must click 'Progress' before marking this order as 'Completed'.");
    console.warn("⚠️ Prevented updating to 'Completed' without 'Progress'.");
    return;
}

  try {
      console.log(`🔄 Updating status for Order ${token} to ${newStatus}...`);

      const response = await axios.post(
          `http://127.0.0.1:8000/api/orders/${token}/status/`,
          { status: newStatus }
      );

      console.log(`✅ Status Updated for ${token}:`, response.data);

      if (response.status === 200) {
          const updatedOrder = response.data;

          setOrders((prevOrders) =>
              prevOrders.map((order) =>
                  order.token === token
                      ? {
                            ...order,
                            status: updatedOrder.status,
                            started_cooking_at: updatedOrder.started_cooking_at || order.started_cooking_at,
                            completed_at: updatedOrder.completed_at || order.completed_at,
                            cancelled_at: updatedOrder.cancelled_at || order.cancelled_at,
                        }
                      : order
              )
          );

          // alert(
          //     `✅ Order Status Updated!\n\nTOKEN: ${token}\nSTATUS: ${updatedOrder.status?.toUpperCase() || "UNKNOWN"}\nStarted: ${
          //         updatedOrder.started_cooking_at || "N/A"
          //     }\nCompleted: ${updatedOrder.completed_at || "N/A"}\nCancelled: ${updatedOrder.cancelled_at || "N/A"}`
          // );
      } else {
          console.error("❌ API response error:", response);
      }
  } catch (error) {
      console.error("❌ Error updating order status:", error.response ? error.response.data : error);

      const currentOrder = orders.find(order => order.token === token);

      // ✅ Check if currentOrder exists before accessing properties
      if (!currentOrder) {
          alert(`⚠️ Error: Order not found!\nTOKEN: ${token}`);
          return;
      }

      // ❌ Show error message with the current status
      if (error.response && error.response.data.error) {
          alert(
              `⚠️ ${error.response.data.error}\n\nTOKEN: ${token}`
          );
        }
          console.log(`🔍 Current Order:`, currentOrder); 
          // alert(`🔍 Current Order Details:\n
          //   TOKEN: ${currentOrder.token}
          //   CUSTOMER: ${currentOrder.customer}
          //   TOTAL PRICE: ${currentOrder.total_price}
          //   CREATED AT: ${currentOrder.created_at}
          //   ITEMS: ${currentOrder.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`);
                
            
      
  }
};


  // Navigate back to Staff Dashboard
  const handleBack = () => {
    navigate('/staff-dashboard'); // Change this route to your Staff Dashboard route
};

  return (
    <div>
      <NavBar />
      <h1 className='orderdetails-header'>ORDER DETAILS</h1>
      <div className='orderdetails-container'>
        <ul className='orderdetails-list'>
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order.token} className='orderdetails-item'>
                <p><strong>TOKEN:</strong> {order.token}</p>
                {/* <p><strong>Customer:</strong> {order.customer_name ? order.customer_name : "N/A" */}
                {/* }</p> */}
                <p><strong>CUSTOMER:</strong> {order.customer || order.customer_name || "N/A"}</p>

                {/* <p><strong>Date/Time:</strong> {new Date(order.created_at).toLocaleString()}</p> */}
                <p>
                <strong>DATE/TIME:</strong>{" "}
                {new Date(order.created_at).toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
                </p>

                <p>
                  <strong>ITEMS:</strong>{" "}
                  {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                </p>
                <p><strong>TOTAL PRICE:</strong> ${order.total_price}</p>
          

                {/* <p>Status: {order.status || "Not Set"}</p> */}
        {/* Order Status Buttons */}
        <button
          onClick={() => updateStatus(order.token, "progress")}
          disabled={order.status === "progress" || order.status === "completed"}
        >
          progress
        </button>

        <button
  onClick={() => {
    if (order.status !== "progress") {
      alert("⚠️ You must mark the order as 'Progress' before completing.");
      return;
    }
    updateStatus(order.token, "completed");
  }}
  // disabled={order.status !== "progress"}
>
  Complete
</button>

        <button
          onClick={() => updateStatus(order.token, "cancelled")}
          disabled={order.status === "completed"}
        >
          Cancel
        </button>

        {/* Display Cooking, Completion, and Cancellation Times */}
{order.started_cooking_at && (
    <p><strong>Cooking Started:</strong> {new Date(order.started_cooking_at).toLocaleString()}</p>
)}
{order.completed_at && (
    <p><strong>Completed At:</strong> {new Date(order.completed_at).toLocaleString()}</p>
)}
{order.cancelled_at && (
    <p><strong>Cancelled At:</strong> {new Date(order.cancelled_at).toLocaleString()}</p>
)}

             </li>

            ))
          ) : (
            <p className='orderdetails-no-orders'>No orders placed today.</p>
          )}
        </ul>
      </div>
      <button className="delete-menu-back-button" onClick={handleBack}>
                Back to Staff Dashboard
            </button>
    </div>
  );
};

export default OrderDetails;
