export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
