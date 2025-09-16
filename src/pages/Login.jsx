import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../component/AuthCard";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", { email, password });

      if (response.data.result?.success) {
        localStorage.setItem("token", response.data.result.token);
        localStorage.setItem("name", response.data.result.userDetails.name);
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
    <AuthCard title="Login to Your Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-xl
                     text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-xl
                       text-gray-800 placeholder-gray-400 pr-12
                       focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 text-white p-3 rounded-xl font-semibold
                     transition-colors duration-200 hover:bg-teal-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-teal-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
