import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Topbar from "../component/Topbar";
import { fetchTransactionDetails } from "../api/transaction";

export default function TransactionsPage() {
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [txDetails, setTxDetails] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const IPFS_GATEWAY = "http://127.0.0.1:8080/ipfs";

  const handleSearch = async () => {
    if (!txHash) return alert("Enter a transaction hash!");

    const token = localStorage.getItem("token");
    if (!token) return alert("You must log in!");

    setLoading(true);
    setError(null);
    setTxDetails(null);

    const result = await fetchTransactionDetails(txHash, token);

    if (result.success) {
      setTxDetails(result.data.details);
    } else {
      setError(result.error || "Transaction not found");
    }

    setLoading(false);
  };

  const handleViewDataset = () => {
    if (!txDetails) return;
    const dataset = {
      name: `Dataset from ${txDetails.blockchainTx.slice(0, 10)}...`,
      images: txDetails.ipfsCid,
    };
    navigate(`/dataset/${txDetails.blockchainTx}`, { state: { dataset } });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🔍 Search Upload by Transaction ID
          </h2>

          {/* Search Form */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter Transaction Hash"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !txHash}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50 transition duration-200"
            >
              {loading ? "Searching..." : "Search Transaction"}
            </button>
          </div>

          {/* Error */}
          {error && <div className="mt-4 text-red-500">❌ {error}</div>}

          {/* Transaction Details */}
          {txDetails && (
            <div className="mt-6 p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-4">
              <h3 className="text-xl font-semibold text-teal-600">
                Transaction Details
              </h3>

              <p>
                <strong className="text-gray-700">Transaction Hash:</strong>{" "}
                <span className="break-all">{txDetails.blockchainTx}</span>
              </p>
              <p>
                <strong className="text-gray-700">Uploader:</strong>{" "}
                {txDetails.uploaderId}
              </p>
              {txDetails.downloaderEmails?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold text-gray-700">Downloaded By:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {txDetails.downloaderEmails.map((email, idx) => (
                      <li key={idx}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p>
                <strong className="text-gray-700">Type:</strong>{" "}
                {txDetails.type}
              </p>
              <p>
                <strong className="text-gray-700">Created:</strong>{" "}
                {new Date(txDetails.createdAt).toLocaleString()}
              </p>

              {Array.isArray(txDetails.fileHash) ? (
                <div>
                  <strong className="text-gray-700">File Hashes:</strong>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {txDetails.fileHash.map((hash, idx) => (
                      <li key={idx}>{hash}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>
                  <strong className="text-gray-700">File Hash:</strong>{" "}
                  {txDetails.fileHash}
                </p>
              )}

              {txDetails.type === "single" && (
                <div className="mt-4">
                  <img
                    src={`${IPFS_GATEWAY}/${txDetails.ipfsCid}`}
                    alt="Uploaded"
                    className="rounded-lg max-w-md border border-gray-300"
                  />
                </div>
              )}

              {txDetails.type === "dataset" && (
                <div className="mt-4">
                  <button
                    onClick={handleViewDataset}
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition duration-200"
                  >
                    📂 View Dataset ({txDetails.ipfsCid.length} files)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
