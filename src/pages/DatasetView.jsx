import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Download, BarChart2 } from "lucide-react"; // Icons
import { fetchImpression } from "../api/summary";

export default function DatasetView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contentTypes, setContentTypes] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [stats, setStats] = useState({ views: 0, downloads: 0, impression: 0 });

  const dataset = location.state?.dataset;

  useEffect(() => {
    if (!dataset) return;

    // Fetch content types for each CID
    const fetchContentTypes = async () => {
      const types = {};
      for (const cid of dataset.images) {
        try {
          const res = await axios.head(`http://127.0.0.1:8080/ipfs/${cid}`);
          types[cid] = res.headers["content-type"];
        } catch (err) {
          console.error("Error fetching content type for", cid, err);
        }
      }
      setContentTypes(types);
    };

    // Fetch stats
    const fetchStats = async () => {
      try {
        console.log(dataset);
        const res = await fetchImpression(dataset.id);
        console.log(res);
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };

    fetchContentTypes();
    fetchStats();
  }, [dataset]);

  if (!dataset) {
    return (
      <div className="p-6 text-white">
        <p>❌ No dataset data found! Please go back.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-accent text-black rounded hover:opacity-90"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen text-white p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-2 px-4 py-2 bg-accent text-black rounded hover:opacity-90"
      >
        ← Back
      </button>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 ml-1">
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
      <p className="text-gray-400 mb-6">📦 Dataset contains {dataset.images.length} items</p>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dataset.images.map((cid, idx) => {
          const url = `http://127.0.0.1:8080/ipfs/${cid}`;
          const type = contentTypes[cid] || "";
          const isVideo = type.startsWith("video/");

          return (
            <div key={idx} className="bg-surface p-2 rounded-lg shadow text-center">
              {isVideo ? (
                <>
                  {activeVideo === idx ? (
                    <video
                      src={url}
                      controls
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="relative rounded-lg w-full h-48 bg-black flex items-center justify-center">
                      <span className="text-gray-400">🎥 Video</span>
                      <button
                        onClick={() => setActiveVideo(idx)}
                        className="absolute bottom-2 px-3 py-1 bg-accent text-black text-sm rounded hover:opacity-90"
                      >
                        ▶ Watch Video
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <img
                  src={url}
                  alt={`Item ${idx + 1}`}
                  className="rounded-lg w-full h-48 object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
