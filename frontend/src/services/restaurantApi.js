import axios from "axios";

const restaurantApi = axios.create({
  baseURL: "http://localhost:3000/api/restaurant",
  withCredentials: true,
});

export const restaurantLogin = (data) => restaurantApi.post("/auth/login", data);
export const restaurantSignup = (data) => restaurantApi.post("/auth/signup", data);
export const restaurantLogout = () => restaurantApi.post("/auth/logout");
export const getRestaurantMe = () => restaurantApi.get("/auth/me");

export const getCategories = () => restaurantApi.get("/categories");
export const addCategory = (data) => restaurantApi.post("/categories", data);
export const updateCategory = (id, data) => restaurantApi.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => restaurantApi.delete(`/categories/${id}`);

export const getRestaurantFoods = () => restaurantApi.get("/foods");
export const addFood = (data) => restaurantApi.post("/foods", data);
export const updateFood = (id, data) => restaurantApi.patch(`/foods/${id}`, data);
export const deleteFood = (id) => restaurantApi.delete(`/foods/${id}`);
