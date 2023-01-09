import axios from "axios";

export const useGetBestFoodSSR = async () => {
  return await axios.get("http://json-server-foodly:80/favFood");
};
