import axios from "axios";

export const useCheckRoleSSR = async (role) => {
  return await axios.get("http://app-backend-foodly:8000/userauth/" + role);
};
