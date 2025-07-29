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
    const loadUploads = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must log in!");
        setLoading(false);
        return;
      }

      const result = await fetchAllUploads(token);

      if (result.success) {
        // ✅ Backend returns uploads array directly
        const mappedUploads = result.data.uploads.map((upload) => {
          if (upload.type === "single") {
            return {
              name: upload.fileName,
              type: "single",
              ipfsCid: upload.ipfsCid, // string
              blockchainTx: upload.blockchainTx,
              id: upload._id,
            };
          } else {
            return {
              name: upload.fileName,
              type: "dataset",
              blockchainTx: upload.blockchainTx,
              images: upload.ipfsCid, // array of CIDs
              id: upload._id,
            };
          }
        });

        setUploads(mappedUploads);
      } else {
        setError(result.error || "Failed to fetch uploads");
      }
      setLoading(false);
    };

    loadUploads();
  }, []);

  return (
    <div className="flex bg-dark min-h-screen text-white">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Uploaded Files & Datasets</h2>

          {/* ✅ Loading State */}
          {loading && <p className="text-gray-400">⏳ Loading uploads...</p>}

          {/* ✅ Error State */}
          {error && <p className="text-red-400">❌ {error}</p>}

          {/* ✅ Render Grid */}
          {!loading && !error && uploads.length > 0 && (
            <UploadedItemsGrid uploads={uploads} />
          )}

          {!loading && uploads.length === 0 && (
            <p className="text-gray-400">No uploads found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
