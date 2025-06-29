import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    console.log("Decoded ➤", decoded);
    return decoded;
  } catch (error) {
    console.error("Decode failed ➤", error);
    return null;
  }
};
