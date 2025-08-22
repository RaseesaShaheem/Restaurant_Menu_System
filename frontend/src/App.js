import { Route, Routes } from 'react-router-dom';
import './App.css';
import MenuComponent from './component/MenuComponent';
import MenuItemDetails from './component/MenuItemDetails';
import StaffLogin from './component/StaffLogin';
import StaffDashboard from './component/StaffDashboard';
import Welcome from './pages/Welcome';
import NutritionalInfo from './component/NutritionalInfo';
import AllergenInfo from './component/AllergenInfo';
import Cart from './component/Cart';
import GenerateReport from './component/GenerateReport';
import OrderDetails from './component/OrderDetails';
// import Orders from './component/Orders';
import { CartProvider } from './component/CartContext';
// import InsertMenu from './component/InsertMenu';
import DeleteMenuItems from './component/DeleteMenuItems';
import AddMenuItem from './component/AddMenuItem';   
import FDSDashboard from'./component/FDSDashboard';
import  MDDashboard from './component/MDDashboard';
function App() {
 




  return (
  <CartProvider >
    <Routes>
      <Route path="/" element={<Welcome/>} />
      <Route path="/menu-item/:id" element={<MenuItemDetails/>} />
      <Route path="/stafflogin" element={<StaffLogin />} /> 
      <Route path="/cart" element={<Cart  />} />
      <Route path="/staff-dashboard" element={<StaffDashboard />} /> 
      <Route path="/order-details" element={<OrderDetails />} />
      <Route path="/menu" element={<MenuComponent/>} />
      <Route path="/allergy-check/:id" element={<AllergenInfo />} />
      <Route path="/nutritional-info/:id" element={<NutritionalInfo />} />
      <Route path="//report generate" element={<GenerateReport />} />
      {/* <Route path="//add-menu-item" element={<InsertMenu />} /> */}
      <Route path="/delet-menu-item" element={<DeleteMenuItems />} />
      <Route path="/add-menu-item" element={<AddMenuItem />} />
      <Route path="/fds-dashboard" element={<FDSDashboard />} />
      <Route path="/md-dashboard" element={<MDDashboard />} />
    </Routes>
    </CartProvider>

  );
}

export default App;
