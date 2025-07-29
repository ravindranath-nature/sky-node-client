const API_BASE = "http://127.0.0.1:5000/api/";

const handleRequest = async (promise) => {
  try {
    const res = await promise;
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || "Something went wrong" };
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ✅ Fetch summary (datasets, images, users)
export const fetchSummary = async () => {
  return await handleRequest(
    fetch(`${API_BASE}files/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
  );
};
export const fetchImpression = async (id) => {
  return await handleRequest(
    fetch(`${API_BASE}files/impression/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
  );
};

// ✅ Fetch all files
export const fetchAllFiles = async () => {
  return await handleRequest(
    fetch(`${API_BASE}files`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
  );
};
export const downloadFile = async (fileId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}download/${fileId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Download failed");

    // Convert to blob for saving
    const blob = await res.blob();

    // Create a temporary download link
    const link = document.createElement("a");
    const fileName = `${fileId}.zip`; // dataset will be zip, single will have actual extension
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (err) {
    console.error("Download error:", err);
    return { success: false, error: err.message };
  }
};