import { useNavigate } from "react-router-dom";
import { logView } from "../api/view";
import { useState } from "react";

export default function UploadedItemsGrid({ uploads = [] }) {
  const navigate = useNavigate();
  const [viewing, setViewing] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUploads, setFilteredUploads] = useState(uploads);

  const isVideo = (filename = "") => /\.(mp4|webm|ogg)$/i.test(filename);

  const handleView = async (file) => {
    const token = localStorage.getItem("token");
    setViewing(file.id);
    const result = await logView(file.id, token);
    setViewing(null);

    if (!result.success) {
      console.error("❌ View log failed:", result.error);
      return;
    }

    if (!result.data.alreadyLogged) {
      console.log("✅ View logged on-chain:", result);
    } else {
      console.log("ℹ️ View already logged before.");
    }

    if (file.type === "dataset") {
      navigate(`/dataset/${file.id}`, {
        state: {
          dataset: { name: file.name, images: file.images, id: file.id },
        },
      });
    } else {
      window.open(
        `http://127.0.0.1:8080/ipfs/${
          Array.isArray(file.ipfsCid) ? file.ipfsCid[0] : file.ipfsCid
        }`,
        "_blank"
      );
    }
  };

  const copyToClipboard = (txId) => {
    navigator.clipboard.writeText(txId).then(() => {
      setCopiedId(txId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return setFilteredUploads(uploads);
    const results = uploads.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredUploads(results);
  };

  return (
    <div className="text-gray-800 p-4">
      <div className="mb-6 flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="🔍 Search uploads..."
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          🔎 Search
        </button>
      </div>

      {filteredUploads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUploads.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {item.name.slice(0, 40) || `Upload ${idx + 1}`}
              </h3>

              {item.type === "single" && (
                <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg h-48 overflow-hidden">
                  {isVideo(item.name) ? (
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500">🎞️ Video File</p>
                      <button
                        onClick={() => handleView(item)}
                        className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                      >
                        ▶️ View Video
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={`http://127.0.0.1:8080/ipfs/${item.ipfsCid}`}
                        alt="Uploaded"
                        className="rounded-lg w-full h-48 object-cover cursor-pointer"
                        onClick={() => handleView(item)}
                      />
                      <button
                        onClick={() => handleView(item)}
                        className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                      >
                        🖼️ View Image
                      </button>
                    </div>
                  )}
                </div>
              )}

              {item.type === "dataset" && (
                <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 h-48">
                  <span className="text-gray-500">📦 Dataset Bundle</span>
                  <button
                    onClick={() => handleView(item)}
                    className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                  >
                    📂 View All
                  </button>
                </div>
              )}

              {item.blockchainTx && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => copyToClipboard(item.blockchainTx)}
                    className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    📋 {copiedId === item.blockchainTx ? "Copied!" : "Copy Transaction ID"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          ❌ No matching uploads found!
          <div className="mt-3">
            <a
              href="/upload"
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
            >
              ➕ Upload Your First File
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
