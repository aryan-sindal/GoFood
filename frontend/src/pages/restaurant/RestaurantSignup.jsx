import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, LockKeyhole, Mail, MapPin, UtensilsCrossed } from "lucide-react";
import { restaurantSignup } from "../../services/restaurantApi";

export default function RestaurantSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", location: "", description: "", image: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await restaurantSignup(form);
      navigate("/restaurant/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create restaurant account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh)] bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white"><UtensilsCrossed /></div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Register your restaurant</h1>
            <p className="mt-1 text-zinc-500">Create your partner account and start building your menu.</p>
          </div>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Restaurant name</span>
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 text-zinc-400" size={18} />
              <input name="name" required value={form.name} onChange={update} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500" placeholder="Domino's" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-zinc-400" size={18} />
              <input type="email" name="email" required value={form.email} onChange={update} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500" placeholder="restaurant@example.com" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Password</span>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3.5 text-zinc-400" size={18} />
              <input type="password" name="password" minLength="6" required value={form.password} onChange={update} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500" placeholder="At least 6 characters" />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Location</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-zinc-400" size={18} />
              <input name="location" value={form.location} onChange={update} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500" placeholder="Varanasi" />
            </div>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Restaurant image URL <span className="font-normal text-zinc-400">(optional)</span> </span>
            <input name="image" value={form.image} onChange={update} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500" placeholder="https://..." />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Description <span className="font-normal text-zinc-400">(optional)</span></span>
            <textarea name="description" value={form.description} onChange={update} rows="4" className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Tell customers what makes your restaurant special..." />
          </label>

          <button disabled={loading} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? "Creating account..." : "Create restaurant account"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already registered? <Link to="/restaurant/login" className="font-bold text-emerald-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
