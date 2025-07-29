import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../component/AuthCard";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", { email, password });

      if (response.data.result?.success) {
        localStorage.setItem("token", response.data.result.token);
        toast.success(response.data.result.message);
        navigate("/");
      } else {
        toast.error(response.data.result?.message || "Login failed.");
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again.";

      if (status === 401) {
        toast.error("Invalid email or password.");
      } else if (status === 403) {
        toast.error("Account not verified. Please check your email.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-black p-3 rounded-lg font-semibold hover:opacity-90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-accent underline">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
