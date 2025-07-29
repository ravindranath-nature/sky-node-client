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
    if (!selectedFiles || selectedFiles.length === 0) {
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
        console.log(result);
      }

      if (result.success) {
        setResponseData(result.data); // full response
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
    <div className="flex bg-dark min-h-screen text-white">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Upload File or Dataset</h2>

          <div className="bg-surface p-6 rounded-lg space-y-4">
            {/* ✅ Radio Buttons */}
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
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

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="dataset"
                  checked={uploadType === "dataset"}
                  onChange={() => setUploadType("dataset")}
                />
                <span>Dataset (Multiple Files)</span>
              </label>
            </div>

            {/* ✅ File Selector */}
            <input
              type="file"
              multiple={uploadType === "dataset"} 
              onChange={handleFileSelection}
              className="block w-full text-sm text-gray-300 bg-dark border border-gray-600 rounded-lg cursor-pointer"
            />

            {/* ✅ Show dataset name input only if dataset selected */}
            {uploadType === "dataset" && (
              <input
                type="text"
                placeholder="Enter Dataset Name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="block w-full p-3 text-sm text-gray-300 bg-dark border border-gray-600 rounded-lg"
              />
            )}

            {/* ✅ Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading || selectedFiles.length === 0}
              className="bg-accent text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : uploadType === "dataset"
                ? `Upload Dataset (${selectedFiles.length} files)`
                : "Upload Single File"}
            </button>

            {selectedFiles.length > 0 && !loading && (
              <p className="text-gray-400 text-sm">
                {selectedFiles.length} file(s) selected.
              </p>
            )}

            {loading && <div className="text-yellow-400">⏳ Uploading...</div>}
          </div>

          {/* ✅ Show error */}
          {error && <div className="mt-4 text-red-400">❌ {error}</div>}

          {/* ✅ Show details after successful upload */}
          {responseData && (
            <div className="mt-6 p-6 bg-gray-800 rounded space-y-4">
              <h3 className="text-xl font-semibold">{responseData.message}</h3>

              <p><strong>Uploader:</strong> {responseData.uploaderId}</p>
              <p>
                <strong>Blockchain Tx:</strong>{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${responseData.blockchainTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  {responseData.blockchainTx}
                </a>
              </p>
              <p><strong>Block Number:</strong> {responseData.blockNumber}</p>

              {/* ✅ If it’s a dataset */}
              {responseData.savedDataset ? (
                <>
                  <p><strong>Dataset Name:</strong> {responseData.savedDataset.fileName}</p>


                  {/* View Dataset Button */}
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
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:opacity-80"
                  >
                    📂 View Full Dataset
                  </button>
                </>
              ) : (
                <>
                  {/* ✅ Single file */}
                  <p><strong>Uploaded File:</strong></p>
                  <img
                    src={`http://127.0.0.1:8080/ipfs/${responseData.ipfsCid}`}
                    alt="Uploaded"
                    className="rounded-lg max-w-md border mt-2"
                  />

                  <a
                    href={`${IPFS_GATEWAY}/${responseData.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:opacity-80"
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
