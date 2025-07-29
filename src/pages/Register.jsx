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
    console.log(response);
    if (response.success) {
      toast.success("Account created! Please verify OTP.");
      navigate(`/otp?email=${encodeURIComponent(formData.email)}`);
    } else {
      toast.error(response.error || "Signup failed.");
    }
  };

  return (
    <AuthCard title="Sign Up">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder="Full Name"
          className="w-full p-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
        />
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-accent pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-black p-3 rounded-lg font-semibold hover:opacity-90"
        >
          Create Account
        </button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent underline">
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
