import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import { useState } from "react";
import { uploadSingleFile, uploadMultipleFiles } from "../api/file";
import { useNavigate } from "react-router-dom";

export default function UploadFile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [datasetName, setDatasetName] = useState("");
  const [uploadType, setUploadType] = useState("file");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const IPFS_GATEWAY = "http://127.0.0.1:8080/ipfs";

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setDatasetName("");
    setResponseData(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("Please select at least one file!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    if (uploadType === "dataset" && !datasetName.trim()) {
      alert("Please enter a dataset name!");
      return;
    }

    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      let result;

      if (uploadType === "file") {
        if (selectedFiles.length > 1) {
          alert("File mode only supports 1 file!");
          setLoading(false);
          return;
        }
        result = await uploadSingleFile(selectedFiles[0]);
      } else {
        result = await uploadMultipleFiles(selectedFiles, datasetName);
      }

      if (result.success) {
        setResponseData(result.data);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Upload File or Dataset</h2>

          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            {/* Upload type selection */}
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  value="file"
                  checked={uploadType === "file"}
                  onChange={() => {
                    setUploadType("file");
                    setDatasetName("");
                  }}
                />
                <span>Single File</span>
              </label>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  value="dataset"
                  checked={uploadType === "dataset"}
                  onChange={() => setUploadType("dataset")}
                />
                <span>Dataset (Multiple Files)</span>
              </label>
            </div>

            {/* File input */}
            <input
              type="file"
              multiple={uploadType === "dataset"}
              onChange={handleFileSelection}
              className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer"
            />

            {/* Dataset name input */}
            {uploadType === "dataset" && (
              <input
                type="text"
                placeholder="Enter Dataset Name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="block w-full p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg"
              />
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={loading || selectedFiles.length === 0}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : uploadType === "dataset"
                ? `Upload Dataset (${selectedFiles.length} files)`
                : "Upload Single File"}
            </button>

            {selectedFiles.length > 0 && !loading && (
              <p className="text-gray-500 text-sm">
                {selectedFiles.length} file(s) selected.
              </p>
            )}

            {loading && <div className="text-yellow-600">⏳ Uploading...</div>}
          </div>

          {/* Error message */}
          {error && <div className="mt-4 text-red-500">❌ {error}</div>}

          {/* Upload details */}
          {responseData && (
            <div className="mt-6 p-6 bg-white rounded-2xl shadow space-y-4">
              <h3 className="text-lg font-semibold">{responseData.message}</h3>

              <p><strong>Uploader:</strong> {responseData.uploaderId}</p>
              <p>
                <strong>Blockchain Tx:</strong>{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${responseData.blockchainTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline"
                >
                  {responseData.blockchainTx}
                </a>
              </p>
              <p><strong>Block Number:</strong> {responseData.blockNumber}</p>

              {/* Dataset or single file view */}
              {responseData.savedDataset ? (
                <>
                  <p><strong>Dataset Name:</strong> {responseData.savedDataset.fileName}</p>
                  <button
                    onClick={() =>
                      navigate(`/dataset/${responseData.savedDataset._id}`, {
                        state: {
                          dataset: {
                            name: responseData.savedDataset.fileName,
                            images: responseData.cidArray,
                          },
                        },
                      })
                    }
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
                  >
                    📂 View Full Dataset
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Uploaded File:</strong></p>
                  <img
                    src={`${IPFS_GATEWAY}/${responseData.ipfsCid}`}
                    alt="Uploaded"
                    className="rounded-lg max-w-md border mt-2"
                  />
                  <a
                    href={`${IPFS_GATEWAY}/${responseData.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                  >
                    🖼️ Open File
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
