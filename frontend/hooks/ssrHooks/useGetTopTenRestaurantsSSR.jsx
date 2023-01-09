import axios from "axios";

export const useGetTopTenRestaurantsSSR = async () => {
  return await axios.get("http://app-backend-foodly:8000/liked/restaurant");
};
