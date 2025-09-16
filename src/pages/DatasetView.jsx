import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Download, BarChart2 } from "lucide-react";
import { fetchImpression } from "../api/summary";
import Modal from "../component/Modal";

export default function DatasetView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contentTypes, setContentTypes] = useState({});
  const [dimensions, setDimensions] = useState({});
  const [selectedModels, setSelectedModels] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [stats, setStats] = useState({ views: 0, downloads: 0, impression: 0 });

  const dataset = location.state?.dataset;

  useEffect(() => {
    if (!dataset) return;

    const fetchMetadata = async () => {
      const types = {};
      const dims = {};

      for (const cid of dataset.images) {
        try {
          const url = `http://127.0.0.1:8080/ipfs/${cid}`;
          const res = await axios.head(url);
          types[cid] = res.headers["content-type"];

          if (res.headers["content-type"].startsWith("image/")) {
            const img = new Image();
            img.src = url;
            await new Promise((resolve) => {
              img.onload = () => {
                dims[cid] = `${img.width}x${img.height}`;
                resolve();
              };
              img.onerror = resolve;
            });
          } else {
            dims[cid] = "N/A";
          }
        } catch (err) {
          console.error("Error fetching metadata for", cid, err);
        }
      }

      setContentTypes(types);
      setDimensions(dims);
    };

    const fetchStats = async () => {
      try {
        const res = await fetchImpression(dataset.id);
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };

    fetchMetadata();
    fetchStats();
  }, [dataset]);

  const handleModelChange = (cid, model) => {
    setSelectedModels((prev) => ({ ...prev, [cid]: model }));
  };

  const handleRunModel = async (cid) => {
    const url = `http://127.0.0.1:8080/ipfs/${cid}`;
    const model = selectedModels[cid];

    if (!model) {
      alert("Please select a model first!");
      return;
    }

    console.log(`Running model ${model} on CID: ${cid}`);
    setSelectedImage(url);
    setIsOpen(true);
    try {
      const res = await axios.post(
        "http://localhost:8001/run-model",
        { cid },
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        const renderedUrl = URL.createObjectURL(res.data);
        setSelectedImage(renderedUrl);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to connect to backend server. Check if it's running.");
    }
  };

  const handlePreview = (cid) => {
    const url = `http://127.0.0.1:8080/ipfs/${cid}`;
    setSelectedImage(url);
    setIsOpen(true);
  };

  if (!dataset) {
    return (
      <div className="p-6 text-gray-700">
        <p>❌ No dataset data found! Please go back.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        ← Back
      </button>

      {/* Stats Row */}
      <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-1">
          <Eye size={16} /> <span>{stats.views} Views</span>
        </div>
        <div className="flex items-center gap-1">
          <Download size={16} /> <span>{stats.downloads} Downloads</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart2 size={16} /> <span>{stats.impression} Impressions</span>
        </div>
      </div>

      {/* Dataset Name */}
      <h2 className="text-2xl font-bold mb-2">{dataset.name}</h2>
      <p className="text-gray-500 mb-6">
        📦 Dataset contains {dataset.images.length} items
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Image
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                CID
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Dimensions
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataset.images.map((cid, idx) => {
              const url = `http://127.0.0.1:8080/ipfs/${cid}`;
              const type = contentTypes[cid] || "";
              const isVideo = type.startsWith("video/");
              const selectedModel = selectedModels[cid] || "";

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  {/* Image Preview */}
                  <td className="px-6 py-3">
                    {isVideo ? (
                      <span className="text-gray-500">🎥 Video</span>
                    ) : (
                      <img
                        src={url}
                        alt={`Item ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    )}
                  </td>

                  {/* CID */}
                  <td className="px-6 py-3 text-gray-700">{cid}</td>

                  {/* Dimensions */}
                  <td className="px-6 py-3 text-gray-600">
                    {dimensions[cid] || "Loading..."}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 flex items-center gap-4">
                    <button
                      onClick={() => handlePreview(cid)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                    >
                      View
                    </button>

                    <select
                      value={selectedModel}
                      onChange={(e) => handleModelChange(cid, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                    >
                      <option value="">Select Model</option>
                      <option value="yolo">YOLO</option>
                      <option value="resnet">ResNet</option>
                      <option value="mobilenet">MobileNet</option>
                    </select>

                    <button
                      disabled={!selectedModel}
                      onClick={() => handleRunModel(cid)}
                      className={`px-3 py-1 text-sm rounded-md transition ${
                        selectedModel
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Run Model
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal preview */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Image Preview"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[70vh] mx-auto rounded-lg"
          />
        )}
      </Modal>
    </div>
  );
}
