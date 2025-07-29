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
    <AuthCard title="Verify OTP">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="w-12 h-12 text-center text-2xl text-white tracking-widest bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-accent"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-black p-3 rounded-lg font-semibold hover:opacity-90"
        >
          Verify
        </button>
        <p className="text-sm text-center text-gray-400">
          Didn’t receive the code?{" "}
          <span
            className="text-accent underline cursor-pointer"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </form>
    </AuthCard>
  );
}
