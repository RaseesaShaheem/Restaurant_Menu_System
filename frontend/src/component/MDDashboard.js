import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useState  } from 'react';
// import axios from 'axios';

import './StaffDashboard.css';
import NavBar from '../pages/NavBar';

const StaffDashboard = () => {
    const navigate=useNavigate();
    // const [orders, setOrders] = useState([]);
  
    // useEffect(() => {
    //   fetchOrders();
    // }, []);
    
  
    // const fetchOrders = async () => {
    //   try {
    //     const response = await axios.get("http://127.0.0.1:8000/api/order/place");
    //     setOrders(response.data);
    //   } catch (error) {
    //     console.error("Error fetching orders:", error);
    //   }
    // };

  return (
  
    <div>
      
       <NavBar></NavBar>
       <h1 className='staffdashboard'>Manager Dashboard</h1>
          <div className='container'>
            <ul className='stafflist'>
                <li className='list-item'>
                    <div className='staff-card' onClick={()=>navigate('/add-menu-item')}>
                      <h2 className='staff-nav'>Insert Menu</h2>
                 {/* <Link to="/insert menu-item" className='staff-nav'>Insert Menu</Link> */}
                   </div></li>
                  <li className='list-item'>
                    <div className='staff-card'onClick={()=>navigate('/delet-menu-item')}>
                    <h2 className='staff-nav'>Delete Menu</h2>
                 </div></li>
                  <li className='list-item'>
                 <div className='staff-card'onClick={()=>navigate('/order-details')}>
                 <h2 className='staff-nav'>Order Details</h2>
                 </div></li>
        <li className='list-item'>
                    <div className='staff-card'onClick={()=>navigate('/report generate')}>
                    <h2 className='staff-nav'>Generate Report</h2>
                 </div> </li>
            </ul>
            </div>
      
    </div>
  );
}

export default StaffDashboard;