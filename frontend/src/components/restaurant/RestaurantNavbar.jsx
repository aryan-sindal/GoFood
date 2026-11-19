import { Link, useNavigate } from "react-router-dom";
import { LogOut, UtensilsCrossed } from "lucide-react";
import { restaurantLogout } from "../../services/restaurantApi";

export default function RestaurantNavbar({ restaurant }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await restaurantLogout();
    } catch {
      // Session can already be expired; still leave the dashboard.
    } finally {
      navigate("/restaurant/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-400 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/restaurant/dashboard" className="flex items-center gap-2 text-xl font-black text-emerald-600 sm:text-2xl">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white">
            <UtensilsCrossed size={19} />
          </span>
          <span>GoFood <span className="text-zinc-900">Partner</span></span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-zinc-900">{restaurant?.name || "Restaurant"}</p>
            <p className="text-xs text-zinc-500">Partner dashboard</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
