import axios from "axios";

export const useGetLocalTypesSSR = async () => {
  return await axios.get("http://app-backend-foodly:8000/category");
};
