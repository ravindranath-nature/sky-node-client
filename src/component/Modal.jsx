// src/components/Modal.jsx
import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Background blur layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* Content Box */}
      <div
        className="relative bg-white rounded-xl shadow-xl p-6 w-[70%] h-[70%] z-10 border border-gray-200"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition font-bold"
          >
            ✕
          </button>
        </div>

        {/* Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20 rounded-xl">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="overflow-auto h-[calc(100%-3rem)] text-gray-700">
          {children}

          {/* Added Input Fields and Submit Button */}
          {!loading && (
            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="What do you think about the prediction?"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <input
                type="text"
                placeholder="Was the prediction accurate?"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <input
                type="text"
                placeholder="Please leave a valuable feedback?"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-teal-500 text-white p-3 rounded-lg font-semibold hover:bg-teal-600 transition-all shadow-md"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
