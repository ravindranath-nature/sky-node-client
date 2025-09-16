import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white p-6 hidden md:block border-r border-gray-200 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">SecureShare</h1>
      <nav className="space-y-3">
        <Link
          to="/"
          className="block text-gray-700 hover:text-teal-500 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/upload"
          className="block text-gray-700 hover:text-teal-500 transition"
        >
          Upload File
        </Link>
        <Link
          to="/transaction"
          className="block text-gray-700 hover:text-teal-500 transition"
        >
          Transactions
        </Link>
        <Link
          to="/files"
          className="block text-gray-700 hover:text-teal-500 transition"
        >
          Uploaded Files
        </Link>
      </nav>
    </div>
  );
}
