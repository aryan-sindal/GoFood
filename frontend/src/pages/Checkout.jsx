import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/publicApi";

export default function Checkout() {
  const { cart, totalPrice, totalItems, loading, fetchCart } = useCart();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setAddress((old) => ({
      ...old,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await placeOrder({
        address,
        paymentMethod,
      });

      setPlacedOrder(response.data.order);

      // Refresh frontend cart after successful order placement.
      await fetchCart();
    } catch (error) {
      console.error("Order placement failed:", error);

      setError(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-10 text-center text-white">
        Loading checkout...
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="text-3xl font-black text-emerald-400">
            Order Placed!
          </h1>

          <p className="mt-3 text-zinc-300">
            Your order has been placed successfully.
          </p>

          <p className="mt-5 text-sm text-zinc-400">
            Order ID
          </p>

          <p className="mt-1 break-all font-bold text-white">
            {placedOrder._id}
          </p>

          <p className="mt-4 text-xl font-black text-emerald-400">
            ₹{placedOrder.totalAmount}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Payment: Cash on Delivery
          </p>

          <Link
            to="/"
            className="mt-7 inline-block rounded-xl bg-emerald-500 px-6 py-3 font-black text-emerald-950 hover:bg-emerald-400"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-white">
          Your cart is empty
        </h1>
        <Link
          to="/"
          className="mt-5 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-bold text-emerald-950"
        >
          Browse food
        </Link>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500";

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <Link
            to="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>

          <h1 className="text-3xl font-black text-white">
            Checkout
          </h1>
          <p className="mt-2 text-zinc-500">
            Enter your delivery details to continue.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Delivery address form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-7"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <MapPin size={21} />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">
                  Delivery Address
                </h2>
                <p className="text-sm text-zinc-500">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Full Name *
                </label>
                <input
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Enter recipient's name"
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  House / Flat Number *
                </label>
                <input
                  name="houseNo"
                  value={address.houseNo}
                  onChange={handleChange}
                  placeholder="House number"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Street / Area *
                </label>
                <input
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="Street or locality"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  City *
                </label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  State *
                </label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  PIN Code *
                </label>
                <input
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-300">
                  Landmark (Optional)
                </label>
                <input
                  name="landmark"
                  value={address.landmark}
                  onChange={handleChange}
                  placeholder="Nearby landmark"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-8 border-t border-zinc-800 pt-6">
              <h2 className="mb-4 text-xl font-black text-white">
                Payment Method
              </h2>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-500 bg-emerald-500/10 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-emerald-500"
                />

                <div>
                  <p className="font-bold text-white">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-zinc-400">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-black text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order summary */}
          <aside className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900 p-6 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center gap-3">
              <ShoppingBag className="text-emerald-400" size={22} />
              <h2 className="text-xl font-black text-white">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between gap-3"
                >
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-sm text-zinc-500">
                      {item.option} × {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-bold text-white">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-zinc-800 pt-5">
              <div className="flex justify-between text-zinc-400">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Delivery Fee</span>
                <span>Calculated later</span>
              </div>

              <div className="flex justify-between border-t border-zinc-800 pt-4">
                <span className="font-black text-white">Subtotal</span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹{totalPrice}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              Final delivery charges, if applicable, will be calculated by the backend.
            </p>
          </aside>

        </div>
      </div>
    </main>
  );
}
