import { useEffect, useState } from "react";
import { Users, ImageIcon, UploadCloud,Eye,Download, Activity } from "lucide-react";
import { fetchSummary, fetchAllFiles, downloadFile } from "../api/summary";
import {  useNavigate } from "react-router-dom";
import { logView } from "../api/view";
import { id } from "ethers";

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
    const result = await logView(file._id,token);
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

    // Route after successful log
    if (file.type === "dataset") {
      navigate(`/dataset/${file._id}`, {
        state: {
          dataset: { name: file.name, images: file.ipfsCid,id:file._id },
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
      <div className="p-6 text-gray-300">⏳ Loading dashboard data...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ Dashboard Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
  <DashboardCard
    title="Total Files"
    value={summary.totalFiles}
    icon={<UploadCloud />}
  />
  <DashboardCard
    title="Datasets"
    value={summary.totalDatasets}
    icon={<UploadCloud />}
  />
  <DashboardCard
    title="Images"
    value={summary.totalImages}
    icon={<ImageIcon />}
  />
  <DashboardCard
    title="Users"
    value={summary.totalUsers}
    icon={<Users />}
  />
  <DashboardCard
    title="Total Views"
    value={summary.totalViews}
    icon={<Eye />}
  />
  <DashboardCard
    title="Total Downloads"
    value={summary.totalDownloads}
    icon={<Download />}
  />
  <DashboardCard
    title="Total Impressions"
    value={summary.totalViews + summary.totalDownloads}
    icon={<Activity />}
  />
</div>

      )}

      <div className="overflow-x-auto bg-surface rounded-xl p-4 shadow-lg">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-sm text-gray-400 uppercase">
              <th className="px-4 py-2">File Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Uploaded At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file._id}
                className="bg-dark hover:bg-gray-800 transition rounded-xl"
              >
                <td className="px-4 py-3 rounded-l-lg">{file.fileName.slice(0, 30)}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      file.type === "dataset"
                        ? "bg-blue-500 text-white"
                        : file.type === "image"
                        ? "bg-purple-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {file.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(file.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 rounded-r-lg flex gap-2">
                  {/* ✅ Controlled View Button */}
                  <button
                    onClick={() => handleView(file)}
                    className="bg-accent text-black px-3 py-1 rounded-md text-sm hover:opacity-90 disabled:opacity-50"
                    disabled={viewing === file._id}
                  >
                    {viewing === file._id ? "Logging..." : "View"}
                  </button>

                  {/* ✅ Download Button */}
                  <button
                    onClick={() => handleDownload(file._id)}
                    disabled={downloading === file._id}
                    className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm hover:opacity-90 disabled:opacity-50"
                  >
                    {downloading === file._id ? "Downloading..." : "Download"}
                  </button>
                </td>
              </tr>
            ))}

            {/* ✅ Empty state */}
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
    <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4 shadow-md">
      <div className="bg-accent text-black rounded-full p-3">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-400">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
