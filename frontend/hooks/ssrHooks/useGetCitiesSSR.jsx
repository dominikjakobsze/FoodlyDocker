import axios from "axios";

export const useGetCitiesSSR = async () => {
  return await axios.get("http://json-server-foodly:80/cities");
};
