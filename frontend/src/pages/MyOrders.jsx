import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin } from "lucide-react";
import { getMyOrders } from "../services/publicApi";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getMyOrders();
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError(
          error.response?.data?.message || "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const formatStatus = (status) =>
    status.replaceAll("_", " ");

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-10 text-center text-white">
        Loading your orders...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={17} /> Back to Home
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <Package size={30} className="text-emerald-400" />
          <div>
            <h1 className="text-3xl font-black text-white">
              My Orders
            </h1>
            <p className="text-sm text-zinc-500">
              View your previous orders and their details.
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </p>
        )}

        {!error && orders.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <Package size={45} className="mx-auto text-zinc-600" />
            <h2 className="mt-4 text-xl font-black text-white">
              No orders yet
            </h2>
            <p className="mt-2 text-zinc-400">
              Your placed orders will appear here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-black text-emerald-950 hover:bg-emerald-400"
            >
              Explore Food
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Order ID
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-white">
                    {order._id}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-400">
                    {formatStatus(order.orderStatus)}
                  </span>
                  <p className="mt-3 text-xl font-black text-white">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              <div className="space-y-4 py-5">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.foodId}-${index}`}
                    className="flex items-center gap-4"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="size-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {item.option} × {item.quantity}
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-bold text-white">
                      ₹{item.lineTotal}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">₹{order.subtotal}</span>
                </div>

                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-zinc-400">Delivery Fee</span>
                  <span className="text-white">₹{order.deliveryFee}</span>
                </div>

                <div className="flex justify-between font-black">
                  <span className="text-white">Total Amount</span>
                  <span className="text-emerald-400">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-zinc-800/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <MapPin size={16} className="text-emerald-400" />
                  Delivery Address
                </div>

                <p className="text-sm leading-6 text-zinc-400">
                  {order.deliveryAddress.fullName},{" "}
                  {order.deliveryAddress.houseNo},{" "}
                  {order.deliveryAddress.street},{" "}
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>

                <p className="mt-3 text-sm text-zinc-400">
                  Payment: {order.paymentMethod} (
                  {order.paymentStatus})
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
