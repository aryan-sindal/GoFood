
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Public food APIs
export const getPublicFoods = () => api.get("/foods");

// User authentication APIs
export const userLogin = (data) => api.post("/auth/login", data);
export const userSignup = (data) => api.post("/auth/register", data);
export const userLogout = () => api.post("/auth/logout");

// Cart APIs
export const getCart = () => api.get("/cart");
export const addCartItem = (data) => api.post("/cart/add", data);
export const updateCartItem = (data) => api.patch("/cart/update", data);
export const removeCartItem = (data) => api.delete("/cart/remove", { data });
export const clearCart = () => api.delete("/cart/clear");

// Order APIs
export const placeOrder = (data) => api.post("/orders/place", data);
export const getMyOrders = () => api.get("/orders/my-orders");
