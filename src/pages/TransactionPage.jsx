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

    // ✅ Create dataset structure expected by DatasetView
    const dataset = {
      name: `Dataset from ${txDetails.blockchainTx.slice(0, 10)}...`,
      images: txDetails.ipfsCid, // this is already an array of CIDs
    };

    // ✅ Pass dataset via state
    navigate(`/dataset/${txDetails.blockchainTx}`, { state: { dataset } });
  };

  return (
    <div className="flex bg-dark min-h-screen text-white">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            🔍 Search Upload by Transaction ID
          </h2>

          {/* ✅ Search Form */}
          <div className="bg-surface p-6 rounded-lg space-y-4">
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter Transaction Hash"
              className="w-full p-3 bg-dark border border-gray-700 rounded"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !txHash}
              className="bg-accent text-black px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Transaction"}
            </button>
          </div>

          {/* ✅ Error */}
          {error && <div className="mt-4 text-red-400">❌ {error}</div>}

          {/* ✅ Transaction Details */}
          {txDetails && (
            <div className="mt-6 p-6 bg-gray-800 rounded space-y-4">
              <h3 className="text-xl font-semibold">Transaction Details</h3>

              <p>
                <strong>Transaction Hash:</strong> {txDetails.blockchainTx}
              </p>
              <p>
                <strong>Uploader:</strong> {txDetails.uploaderId}
              </p>
              {txDetails.downloaderEmails && txDetails.downloaderEmails.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold text-white">Downloaded By:</p>
                  <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                    {txDetails.downloaderEmails.map((email, idx) => (
                      <li key={idx}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p>
                <strong>Type:</strong> {txDetails.type}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(txDetails.createdAt).toLocaleString()}
              </p>

              {/* ✅ File Hash (Single or Multiple) */}
              {Array.isArray(txDetails.fileHash) ? (
                <div>
                  <strong>File Hashes:</strong>
                  <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                    {txDetails.fileHash.map((hash, idx) => (
                      <li key={idx}>{hash}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>
                  <strong>File Hash:</strong> {txDetails.fileHash}
                </p>
              )}

              {/* ✅ Show single image directly */}
              {txDetails.type === "single" && (
                <div className="mt-4">
                  <img
                    src={`${IPFS_GATEWAY}/${txDetails.ipfsCid}`}
                    alt="Uploaded"
                    className="rounded-lg max-w-md border"
                  />
                </div>
              )}

              {/* ✅ For dataset, show a button */}
              {txDetails.type === "dataset" && (
                <div className="mt-4">
                  <button
                    onClick={handleViewDataset}
                    className="px-6 py-3 bg-accent text-black rounded-lg font-semibold hover:opacity-90"
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
