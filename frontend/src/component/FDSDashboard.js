import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './StaffDashboard.css';
import NavBar from '../pages/NavBar';
function StaffDashboard() {
    const navigate=useNavigate();

  return (
  
    <div>
       <NavBar></NavBar>
       <h1 className='staffdashboard'>Food Data Specialist</h1>
          <div className='container'>
            <ul className='stafflist'>
                <li className='list-item'>
                    <div className='staff-card' onClick={()=>navigate('/add-menu-item')}>
                      <h2 className='staff-nav'>Insert Menu</h2>
                 <Link to="/insert menu-item" className='staff-nav'></Link>
                   </div></li>
                  <li className='list-item'>
                    <div className='staff-card'onClick={()=>navigate('/delet-menu-item')}>
                    <h2 className='staff-nav'>Delete Menu</h2>
                 </div></li>
                  {/* <li className='list-item'>
                 <div className='staff-card'onClick={()=>navigate('/order-details')}>
                 <h2 className='staff-nav'>Order Details</h2>
                 </div></li> */}
                  {/* <li className='list-item'>
                    <div className='staff-card'onClick={()=>navigate('/report generate')}>
                    <h2 className='staff-nav'>Generate Report</h2>
                 </div> </li> */}
            </ul>
            </div>
      
    </div>
  );
}

export default StaffDashboard;