import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../component/AuthCard";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "../api/auth"; // ✅ use your auth wrapper

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await signup(formData);
    if (response.success) {
      toast.success("Account created! Please verify OTP.");
      navigate(`/otp?email=${encodeURIComponent(formData.email)}`);
    } else {
      toast.error(response.error || "Signup failed.");
    }
  };

  return (
    <AuthCard title="Create Your Account">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder="Full Name"
          className="w-full p-3 bg-white border border-gray-300 rounded-xl 
                     text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email Address"
          className="w-full p-3 bg-white border border-gray-300 rounded-xl 
                     text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
          className="w-full bg-teal-500 text-white p-3 rounded-xl font-semibold
                     transition-colors duration-200 hover:bg-teal-400"
        >
          Create Account
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
