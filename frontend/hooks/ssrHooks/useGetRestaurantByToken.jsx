import axios from "axios";
export const useGetRestaurantByToken = async () => {
  return await axios.get("http://app-backend-foodly:8000/restaurant-by-token");
};
