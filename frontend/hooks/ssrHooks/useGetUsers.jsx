import axios from "axios";
export const useGetUsers = async () => {
  return await axios.get("http://app-backend-foodly:8000/userauth");
};
