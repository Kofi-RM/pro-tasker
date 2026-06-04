
import React, { useState } from "react";

import axios from "axios";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          email,
          password,
        }
      );

      // save token
      localStorage.setItem("token", data.token);

      // redirect
      window.location.href = "/dashboard";
    } catch (err:unknown) {
     if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Login failed");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 h-96 w-96 bg-indigo-600/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-cyan-500/20 blur-3xl rounded-full" />
    </div>

    <div className="relative w-full max-w-md">
      <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-2xl font-bold text-white">P</span>
          </div>

         <h1 className="text-4xl font-extrabold tracking-tight">
  <span className="text-white">Pro</span>
  <span className="text-cyan-400">Tasker</span>
</h1>

          <p className="text-slate-400 mt-2">
            Organize projects. Complete tasks.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="
                w-full
                px-4
                py-3
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                text-slate-100
                placeholder-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-indigo-500
                transition
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="
                w-full
                px-4
                py-3
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                text-slate-100
                placeholder-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-indigo-500
                transition
              "
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-500
              disabled:opacity-50
              text-white
              font-semibold
              py-3
              rounded-xl
              transition-all
              duration-200
              hover:scale-[1.02]
            "
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-4 text-slate-500">
              OR
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.href =
              "http://localhost:3001/api/users/auth/github";
          }}
          className="
            w-full
            bg-slate-800
            hover:bg-slate-700
            border
            border-slate-700
            text-slate-100
            font-medium
            py-3
            rounded-xl
            transition
          "
        >
          Continue with GitHub
        </button>

        <p className="text-center text-slate-500 text-sm mt-8">
          Built for teams and individuals who get things done.
        </p>
      </div>
    </div>
  </div>
);}
export default Login;
