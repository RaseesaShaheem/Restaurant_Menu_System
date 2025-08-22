import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './StaffLogin.css';

const StaffLogin = () => {
  const [staffId, setStaffId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (staffId === "MD00" && name === "MANAGER") {
      navigate("/md-dashboard"); // ✅ Redirect to senior staff dashboard
      return;
    }

    if (staffId === "FDS00" && name === "BRISTO") {
      navigate("/fds-dashboard"); // ✅ Redirect to senior staff dashboard
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/staff-login/", {
        staff_id: staffId,
        name: name,
      });
      if (response.status === 200) {
        navigate("/staff-dashboard");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-card">
      <h2>Staff Login</h2>
      <form  onSubmit={handleLogin}>
        <div>
          <label>Staff ID</label>
          <input
            type="text"
            placeholder="STAFFID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name</label>
          <input 
            type="text"
             placeholder="NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {error && <p >{error}</p>}
        <div>
        <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default StaffLogin;