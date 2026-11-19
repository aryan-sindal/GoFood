import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LocateFixed, MapPin, UserPlus } from "lucide-react";
import { userSignup } from "../services/publicApi";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", address: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }));

  
async function getLocation() {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const { latitude, longitude } = coords;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch address");
        }

        const data = await response.json();
        const address = data.address;

        const formattedAddress = [
          address.road,
          address.suburb || address.neighbourhood,
          address.city || address.town || address.village,
          address.state,
          address.postcode,
          address.country
        ]
          .filter(Boolean)
          .join(", ");

        setForm((old) => ({
          ...old,
          address: formattedAddress
        }));

        setError("");
      } catch (err) {
        setError("Unable to convert location into an address. Enter it manually.");
      }
    },
    () => {
      setError("Unable to get your location. Enter your address manually.");
    }
  );
}


  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await userSignup(form);
      localStorage.setItem("gofood-user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("gofood-auth-changed"));
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white"><UserPlus /></div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Create your GoFood account</h1>
            <p className="mt-1 text-zinc-500">Save your details and start ordering.</p>
          </div>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Name</span>
            <input name="username" required value={form.username} onChange={update} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Your name" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Email</span>
            <input name="email" type="email" required value={form.email} onChange={update} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500" placeholder="you@example.com" />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Address</span>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <MapPin className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input name="address" required value={form.address} onChange={update} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500" placeholder="Enter your delivery address" />
              </div>
              <button type="button" onClick={getLocation} title="Use current location" className="grid shrink-0 place-items-center rounded-xl bg-emerald-50 px-4 text-emerald-700 hover:bg-emerald-100">
                <LocateFixed size={19} />
              </button>
            </div>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">Password</span>
            <input name="password" type="password" minLength="6" required value={form.password} onChange={update} className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-emerald-500" placeholder="At least 6 characters" />
          </label>

          <button disabled={loading} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
            {loading ? "Creating account..." : "Create account"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="font-bold text-emerald-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
