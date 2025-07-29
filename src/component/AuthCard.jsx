export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
