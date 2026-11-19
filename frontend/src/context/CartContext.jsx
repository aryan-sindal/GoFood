
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  getCart as getCartApi,
  addCartItem,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
  updateCartItem as updateCartItemApi,
} from "../services/publicApi";

const CartContext = createContext(null);

// Convert MongoDB cart response into the format used by our UI.
function formatCartItems(items = []) {
  return items
    .filter((item) => item.food)
    .map((item) => {
      const food = item.food;

      const restaurantId =
        food.restaurantId?._id || food.restaurantId || null;

      return {
        key: `${restaurantId || "gofood"}-${food._id}-${item.option}`,
        foodId: food._id,
        restaurantId,
        restaurantName:
          food.restaurantName ||
          food.restaurantId?.name ||
          "GoFood Kitchen",
        name: food.name,
        img: food.img,
        option: item.option,
        price: Number(item.amount),
        quantity: item.quantity,
      };
    });
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend.
  const fetchCart = useCallback(async () => {
    try {
      const response = await getCartApi();

      setCart(formatCartItems(response.data.cart.items));
    } catch (error) {
      if (error.response?.status === 401) {
        setCart([]);
      } else {
        console.error("Failed to fetch cart:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart initially and whenever authentication changes.
  useEffect(() => {
    fetchCart();

    window.addEventListener("gofood-auth-changed", fetchCart);
    window.addEventListener("storage", fetchCart);

    return () => {
      window.removeEventListener("gofood-auth-changed", fetchCart);
      window.removeEventListener("storage", fetchCart);
    };
  }, [fetchCart]);

  // Add food to backend cart.
  async function addToCart(food, option, quantity) {
    try {
      const response = await addCartItem({
        foodId: food._id || food.id,
        option: option.type,
        quantity,
      });

      setCart(formatCartItems(response.data.cart.items));
    } catch (error) {
      console.error("Failed to add item:", error);
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  }

  // Remove food from backend cart.
  async function removeFromCart(key) {
    const item = cart.find((item) => item.key === key);

    if (!item) return;

    try {
      const response = await removeCartItemApi({
        foodId: item.foodId,
        option: item.option,
      });

      setCart(formatCartItems(response.data.cart.items));
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert(error.response?.data?.message || "Failed to remove item");
    }
  }

  // Update quantity of an existing cart item.
  async function updateQuantity(foodId, option, quantity) {
    try {
      const response = await updateCartItemApi({
        foodId,
        option,
        quantity,
      });

      setCart(formatCartItems(response.data.cart.items));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  }

  // Clear backend cart.
  async function clearCart() {
    try {
      await clearCartApi();
      setCart([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert(error.response?.data?.message || "Failed to clear cart");
    }
  }

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
