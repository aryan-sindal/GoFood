
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    loading,
    totalPrice,
    totalItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Your order
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">Cart</h1>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-zinc-900"
          >
            <ArrowLeft size={17} /> Continue shopping
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <p className="font-bold text-zinc-300">Loading your cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <h2 className="text-2xl font-black text-white">
              Your cart is empty
            </h2>
            <p className="mt-2 text-zinc-500">
              Add something delicious from the menu.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-black text-emerald-950"
            >
              Browse food
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
              {cart.map((item, index) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-4 border-b border-zinc-800 p-5 last:border-0 sm:flex-row sm:items-center"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 font-black text-emerald-400">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-black text-white">{item.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.restaurantName} · {item.option}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      ₹{item.price} per item
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.foodId,
                          item.option,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="grid size-8 place-items-center rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>

                    <span className="min-w-5 text-center font-bold text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.foodId,
                          item.option,
                          item.quantity + 1
                        )
                      }
                      className="grid size-8 place-items-center rounded-lg bg-zinc-800 text-white hover:bg-zinc-700"
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <div className="font-black text-white">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="grid size-10 place-items-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <aside className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900 p-6 lg:sticky lg:top-24">
              <p className="text-sm font-bold text-zinc-500">
                Order summary
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-zinc-400">Items</span>
                <span className="font-bold text-white">{totalItems}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-4">
                <span className="font-black text-white">Total</span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹{totalPrice}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-xl bg-emerald-500 px-4 py-3 text-center font-black text-emerald-950 hover:bg-emerald-400"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={clearCart}
                className="mt-2 w-full rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-400 hover:bg-red-500/10"
              >
                Clear cart
              </button>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}
