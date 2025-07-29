import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-surface p-6 hidden md:block">
      <h1 className="text-2xl font-bold mb-6">SecureShare</h1>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-accent">Dashboard</Link>
        <Link to="/upload" className="block hover:text-accent">Upload File</Link>
        <Link to="/transaction" className="block hover:text-accent">Transactions</Link>
        <Link to="/files" className="block hover:text-accent">
          Uploaded Files
        </Link>
      </nav>
    </div>
  );
}
