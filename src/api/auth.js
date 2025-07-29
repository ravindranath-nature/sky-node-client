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

const signup = async (data) => {
  const filteredData = Object.keys(data).reduce((acc, key) => {
    if (key === "name" || key === "email" || key === "password") {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return await handleRequest(axios.post("/auth/register", filteredData));
};

const verifyOtp = async (email, code) => {
  return await handleRequest(axios.post("/auth/verify", { email, code }));
};

const resendOtp = async (email) => {
  return await handleRequest(axios.post("/auth/resend", { email }));
};

const login = async (email, password) => {
  return await handleRequest(axios.post("/auth/login", { email, password }));
};

const logout = async () => {
  return await handleRequest(axios.post("/auth/logout"));
};

export { signup, verifyOtp, resendOtp, login, logout };

