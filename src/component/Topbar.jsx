import { useState, useEffect } from "react";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fullName = localStorage.getItem("name");

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
      <span className="text-lg font-medium text-gray-800">
        Welcome, {fullName}
      </span>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
        >
          Logout
        </button>
      ) : (
        <div className="space-x-3">
          <a
            href="/login"
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Register
          </a>
        </div>
      )}
    </div>
  );
}
