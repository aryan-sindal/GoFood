import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getRestaurantMe } from "../../services/restaurantApi";

export default function RestaurantProtectedRoute({ children }) {
  const [state, setState] = useState({ loading: true, restaurant: null });

  useEffect(() => {
    let active = true;

    getRestaurantMe()
      .then((res) => {
        if (active) setState({ loading: false, restaurant: res.data.restaurant });
      })
      .catch(() => {
        if (active) setState({ loading: false, restaurant: null });
      });

    return () => { active = false; };
  }, []);

  if (state.loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-50 text-zinc-500">
        Checking restaurant session...
      </div>
    );
  }

  if (!state.restaurant) {
    return <Navigate to="/restaurant/login" replace />;
  }

  return children({
    restaurant: state.restaurant,
  });
}
