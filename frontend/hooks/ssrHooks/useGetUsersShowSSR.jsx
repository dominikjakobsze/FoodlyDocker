import axios from "axios";
export const useGetUsersShowSSR = async () => {
  return await axios.get("http://json-server-foodly:80/users");
};
