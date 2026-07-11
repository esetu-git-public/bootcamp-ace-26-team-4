import axios from "axios";

const API = "http://localhost:8000/api";

export const getDashboardData = async () => {
  try {
    const res = await axios.get(`${API}/dashboard`);
    return res.data;
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return {
      documents: 0,
      questions: 0,
      status: "Offline",
      recent: [],
    };
  }
};