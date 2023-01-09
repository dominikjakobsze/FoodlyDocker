import axios from "axios";
export const useGetAllCitiesSSR = async () => {
  return await axios.get("http://app-backend-foodly:8000/city");
};
