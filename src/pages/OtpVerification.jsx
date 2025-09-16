import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthCard from "../component/AuthCard";
import { verifyOtp, resendOtp } from "../api/auth";
import { toast } from "react-hot-toast";

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get("email");
    if (!emailFromUrl) {
      toast.error("No email found, please sign up again");
      navigate("/signup");
    } else {
      setEmail(emailFromUrl);
    }
  }, [location, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    const res = await verifyOtp(email, code);
    if (res.success) {
      toast.success("OTP verified successfully!");
      navigate("/login");
    } else {
      toast.error(res.error || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    const res = await resendOtp(email);
    if (res.success) {
      toast.success("OTP resent successfully");
    } else {
      toast.error(res.error || "Failed to resend OTP");
    }
  };

  return (
    <AuthCard title="Verify OTP" className="bg-white shadow-md rounded-2xl p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="w-14 h-14 text-center text-2xl font-semibold text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold tracking-wide hover:bg-teal-600 transition-colors"
        >
          Verify OTP
        </button>
        <p className="text-sm text-center text-gray-600">
          Didn’t receive the code?{" "}
          <span
            className="text-teal-600 font-medium cursor-pointer hover:underline"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </form>
    </AuthCard>
  );
}
