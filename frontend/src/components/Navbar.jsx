
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogIn,
  Menu,
  ShoppingCart,
  Store,
  UserPlus,
  X,
  Package,
} from "lucide-react";

import { userLogout } from "../services/publicApi";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  const [open, setOpen] = useState(false);

  const storedUser = localStorage.getItem("gofood-user");
  let currentUser = null;

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    currentUser = null;
  }

  const loggedIn = Boolean(currentUser);

  async function logout() {
    try {
      await userLogout();
    } catch {
      // Local session is still cleared if the server session is already gone.
    } finally {
      localStorage.removeItem("gofood-user");
      window.dispatchEvent(new Event("gofood-auth-changed"));
      setOpen(false);
      navigate("/");
    }
  }

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-600/20 bg-emerald-500 shadow-md">
      <div className="mx-auto flex h-18 max-w-400 items-center gap-6 px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 text-3xl font-black italic tracking-tight text-white sm:text-4xl"
        >
          GoFood
        </Link>

        {/* Home */}
        <Link
          to="/"
          onClick={closeMenu}
          className="hidden text-base font-extrabold text-white hover:text-emerald-950 sm:block"
        >
          Home
        </Link>

        {/* Desktop Navigation */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {loggedIn ? (
            <>
              <span className="px-2 text-sm font-bold text-white">
                {currentUser?.username || "User"}
              </span>

              {/* My Orders */}
              <Link
                to="/my-orders"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-extrabold text-white transition hover:bg-white/10"
              >
                <Package size={18} />
                My Orders
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-extrabold text-emerald-700 transition hover:bg-emerald-50"
              >
                <ShoppingCart size={18} />
                Cart
                <span className="grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {totalItems}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="rounded-xl bg-white px-4 py-2.5 font-extrabold text-emerald-700 hover:bg-emerald-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/restaurant/login"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-white hover:bg-white/10"
              >
                <Store size={17} />
                Partner
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-extrabold text-emerald-700 hover:bg-emerald-50"
              >
                <LogIn size={17} />
                Login
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-4 py-2.5 font-extrabold text-white hover:bg-white/10"
              >
                <UserPlus size={17} />
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen((old) => !old)}
          className="ml-auto rounded-xl p-2 text-white hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-white/15 bg-emerald-600 px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-400 flex-col gap-2">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-bold text-white hover:bg-white/10"
            >
              Home
            </Link>

            {loggedIn ? (
              <>
                {/* My Orders */}
                <Link
                  to="/my-orders"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 font-bold text-white hover:bg-white/10"
                >
                  <Package size={18} />
                  My Orders
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-white hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Cart
                  </span>

                  <span className="rounded-full bg-red-500 px-2 text-xs">
                    {totalItems}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="rounded-xl px-4 py-3 text-left font-bold text-white hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/restaurant/login"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-bold text-white hover:bg-white/10"
                >
                  Restaurant partner
                </Link>

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-bold text-white hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-bold text-white hover:bg-white/10"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
