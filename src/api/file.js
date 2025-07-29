const API_BASE = "http://127.0.0.1:5000/api";

const handleRequest = async (promise) => {
  try {
    const response = await promise;

    // Try parsing JSON safely
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Upload failed");
    }

    const isSuccess = typeof data.success === "boolean" ? data.success : true;

    return { success: isSuccess, data };
  } catch (err) {
    return { success: false, error: err.message || "Something went wrong" };
  }
};

const isNode = typeof window === "undefined";

const getFetchOptions = (method, body, token) => {
  const options = {
    method,
    body,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (isNode && body) {
    options.duplex = "half";
  }

  return options;
};

// ✅ Single file upload stays same
const uploadSingleFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage?.getItem("token");

  const fetchOptions = getFetchOptions("POST", formData, token);

  return await handleRequest(
    fetch(`${API_BASE}/blockchain/upload-single`, fetchOptions)
  );
};

// ✅ Multiple files upload with datasetName support
const uploadMultipleFiles = async (files, datasetName) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  // ✅ Append dataset name only if provided
  if (datasetName) {
    formData.append("datasetName", datasetName);
  }

  const token = localStorage?.getItem("token");

  const fetchOptions = getFetchOptions("POST", formData, token);

  return await handleRequest(
    fetch(`${API_BASE}/blockchain/upload-multiple`, fetchOptions)
  );
};

export { uploadSingleFile, uploadMultipleFiles };
