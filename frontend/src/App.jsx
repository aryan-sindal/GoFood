import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import RestaurantSignup from "./pages/restaurant/RestaurantSignup";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantProtectedRoute from "./pages/restaurant/RestaurantProtectedRoute";

function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      <Route path="/restaurant/login" element={<RestaurantLogin />} />
      <Route path="/restaurant/signup" element={<RestaurantSignup />} />
      <Route
        path="/restaurant/dashboard"
        element={
          <RestaurantProtectedRoute>
            {({ restaurant }) => <RestaurantDashboard initialRestaurant={restaurant} />}
          </RestaurantProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
