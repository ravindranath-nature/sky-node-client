import { useEffect, useState } from "react";
import { Users, ImageIcon, UploadCloud, Eye, Download, Activity } from "lucide-react";
import { fetchSummary, fetchAllFiles, downloadFile } from "../api/summary";
import { useNavigate } from "react-router-dom";
import { logView } from "../api/view";

export default function FileTable() {
  const [summary, setSummary] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [viewing, setViewing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [summaryRes, filesRes] = await Promise.all([
        fetchSummary(),
        fetchAllFiles(),
      ]);
      if (summaryRes.success) setSummary(summaryRes.data);
      if (filesRes.success) setFiles(filesRes.data.files);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleView = async (file) => {
    const token = localStorage.getItem("token");
    setViewing(file._id);
    const result = await logView(file._id, token);
    setViewing(null);
    console.log(result);
    if (!result.success) {
      console.error("❌ View log failed:", result.error);
      return;
    }

    if (!result.data.alreadyLogged) {
      console.log("✅ View logged on-chain:", result.data.txHash);
    } else {
      console.log("ℹ️ View already logged before.");
    }

    if (file.type === "dataset") {
      navigate(`/dataset/${file._id}`, {
        state: {
          dataset: { name: file.name, images: file.ipfsCid, id: file._id },
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

  const handleDownload = async (fileId) => {
    setDownloading(fileId);
    const res = await downloadFile(fileId);
    if (!res.success) alert("❌ Failed to download");
    setDownloading(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">⏳ Loading dashboard data...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Dashboard Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <DashboardCard title="Total Files" value={summary.totalFiles} icon={<UploadCloud />} />
          <DashboardCard title="Datasets" value={summary.totalDatasets} icon={<UploadCloud />} />
          <DashboardCard title="Images" value={summary.totalImages} icon={<ImageIcon />} />
          <DashboardCard title="Users" value={summary.totalUsers} icon={<Users />} />
          <DashboardCard title="Total Views" value={summary.totalViews} icon={<Eye />} />
          <DashboardCard title="Total Downloads" value={summary.totalDownloads} icon={<Download />} />
          <DashboardCard title="Total Impressions" value={summary.totalViews + summary.totalDownloads} icon={<Activity />} />
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-sm text-gray-500 uppercase">
              <th className="px-4 py-2">Folder Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Uploaded on</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file._id}
                className="bg-gray-50 hover:bg-gray-100 transition rounded-lg"
              >
                <td className="px-4 py-3 rounded-l-lg text-gray-800">
                  {file.fileName.slice(0, 30)}
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      file.type === "dataset"
                        ? "bg-teal-100 text-teal-700"
                        : file.type === "image"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {file.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(file.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 rounded-r-lg flex gap-2">
                  <button
                    onClick={() => handleView(file)}
                    className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm hover:bg-teal-600 transition disabled:opacity-50"
                    disabled={viewing === file._id}
                  >
                    {viewing === file._id ? "Logging..." : "View"}
                  </button>

                  <button
                    onClick={() => handleDownload(file._id)}
                    disabled={downloading === file._id}
                    className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-md text-sm hover:bg-yellow-500 transition disabled:opacity-50"
                  >
                    {downloading === file._id ? "Downloading..." : "Download"}
                  </button>
                </td>
              </tr>
            ))}

            {files.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-400 py-4 italic"
                >
                  No files found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-200">
      <div className="bg-teal-100 text-teal-700 rounded-full p-3">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
