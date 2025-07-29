import { useState, useEffect } from "react";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    setIsLoggedIn(false);
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <div className="bg-surface p-4 flex items-center justify-between border-b border-gray-800">
      <span className="text-lg font-semibold">Welcome, Researcher</span>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-90"
        >
          Logout
        </button>
      ) : (
        <div className="space-x-3">
          <a
            href="/login"
            className="bg-accent text-black px-4 py-2 rounded hover:opacity-90"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Register
          </a>
        </div>
      )}
    </div>
  );
}
