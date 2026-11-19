import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, UtensilsCrossed } from "lucide-react";
import { restaurantLogin } from "../../services/restaurantApi";

export default function RestaurantLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await restaurantLogin(form);
      navigate("/restaurant/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh)] place-items-center bg-zinc-950 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden min-h-155 bg-[url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center lg:block">
          <div className="flex h-full flex-col justify-end bg-linear-to-tr from-black/80 via-black/20 to-transparent p-10 text-white">
            <p className="mb-2 font-bold text-emerald-300">GoFood Partners</p>
            <h1 className="text-4xl font-black">Run your menu. Grow your restaurant.</h1>
            <p className="mt-3 max-w-md text-white/75">Manage categories, dishes and pricing from one focused dashboard.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white">
              <UtensilsCrossed />
            </div>
            <h2 className="text-3xl font-black text-zinc-900">Restaurant login</h2>
            <p className="mt-2 text-zinc-500">Sign in to manage your GoFood menu.</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input type="email" id="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="restaurant@example.com" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">Password</span>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="••••••••" />
              </div>
            </label>

            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            New restaurant?{" "}
            <Link to="/restaurant/signup" className="font-bold text-emerald-700 hover:underline">Create partner account</Link>
          </p>
          <p className="mt-3 text-center text-sm">
            <Link to="/" className="font-bold text-zinc-600 hover:text-zinc-900">Back to GoFood</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
