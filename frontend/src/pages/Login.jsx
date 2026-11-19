import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { userLogin } from "../services/publicApi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    
    try {
      const res = await userLogin({ email, password });
      localStorage.setItem("gofood-user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("gofood-auth-changed"));

      const destination = location.state?.from?.pathname || "/";
      
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-4.5rem)] place-items-center bg-zinc-950 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center lg:block">
          <div className="flex h-full min-h-150 flex-col justify-end bg-linear-to-tr from-black/80 via-black/20 to-transparent p-10 text-white">
            <p className="font-bold text-emerald-300">Welcome back</p>
            <h1 className="mt-2 text-4xl font-black">Good food is waiting.</h1>
            <p className="mt-3 max-w-md text-white/75">Sign in to access your cart and continue ordering.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-black text-zinc-900">User login</h2>
          <p className="mt-2 text-zinc-500">Enter your account details to continue.</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">Email address</span>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="you@example.com" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-zinc-700">Password</span>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-zinc-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="••••••••" />
              </div>
            </label>

            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            New to GoFood? <Link to="/signup" className="font-bold text-emerald-700 hover:underline">Create an account</Link>
          </p>
          <p className="mt-3 text-center text-sm text-zinc-500">
            Restaurant owner? <Link to="/restaurant/login" className="font-bold text-zinc-900 hover:text-emerald-700">Partner with us</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
