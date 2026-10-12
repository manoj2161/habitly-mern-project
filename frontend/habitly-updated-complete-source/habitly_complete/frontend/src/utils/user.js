import { getToken, clearAuth } from "./auth";
import axios from "axios";
import { profile } from "../api/endpoints";

export const getCurrentUser = async () => {
  const token = getToken();

  if (!token) return null;

  try {
    const response = await axios.get(profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      clearAuth();
    }
    return null;
  }
};
