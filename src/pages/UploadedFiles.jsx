import { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import UploadedItemsGrid from "../component/UploadedItemsGrid";
import { fetchAllUploads } from "../api/transaction";

export default function UploadedFiles() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadUploads = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must log in!");

        const result = await fetchAllUploads(token);
        if (!isMounted) return;

        if (result.success && result.data?.uploads) {
          const mappedUploads = result.data.uploads.map((upload) => ({
            id: upload._id,
            name: upload.fileName,
            type: upload.type,
            blockchainTx: upload.blockchainTx,
            ...(upload.type === "single"
              ? { ipfsCid: upload.ipfsCid }
              : { images: upload.ipfsCid }),
          }));

          setUploads(mappedUploads);
        } else {
          throw new Error(result.error || "Failed to fetch uploads");
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUploads();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex bg-white min-h-screen text-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Uploaded Files & Datasets
          </h2>

          {loading && (
            <div className="text-gray-500 text-sm">⏳ Loading uploads...</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-sm text-sm">
              ❌ {error}
            </div>
          )}

          {!loading && !error && uploads.length > 0 && (
            <div className="mt-6">
              <UploadedItemsGrid uploads={uploads} />
            </div>
          )}

          {!loading && !error && uploads.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">
              No uploads found yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
