import axios from "./axios";

const handleRequest = async (request) => {
  try {
    const response = await request;

    const isSuccess =
      typeof response.data.success === "boolean"
        ? response.data.success
        : true;

    return {
      success: isSuccess,
      data: response.data,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return { success: false, error: message };
  }
};

// 📄 Log a view (only once per file-user)
export const logView = async (fileId, token) => {
  
  return await handleRequest(
    axios.post(
      `/view/${fileId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
};
