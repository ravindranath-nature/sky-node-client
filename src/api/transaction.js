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
      data: response.data
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
export const fetchTransactionDetails = async (txHash, token) => {
  return await handleRequest(
    axios.get(`/transaction/${txHash}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};

 export const fetchAllUploads = async (token) => {
  return await handleRequest(
    axios.get("/upload/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
  );
};
