import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import MainLayout from "../components/MainLayout";
import Products from "../pages/Products";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Receipts from "../pages/operations/Receipts";
import Deliveries from "../pages/operations/Deliveries";
import Transfers from "../pages/operations/Transfers";
import Adjustments from "../pages/operations/Adjustments";
import MoveHistory from "../pages/operations/MoveHistory";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Private routes with MainLayout */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/operations/receipts" element={<Receipts />} />
          <Route path="/operations/deliveries" element={<Deliveries />} />
          <Route path="/operations/transfers" element={<Transfers />} />
          <Route path="/operations/adjustments" element={<Adjustments />} />
          <Route path="/operations/history" element={<MoveHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
