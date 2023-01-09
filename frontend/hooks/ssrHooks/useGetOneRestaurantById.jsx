import axios from "axios";

export const useGetOneRestaurantById = async (id) => {
  return await axios.get("http://app-backend-foodly:8000/restaurant/" + id);
};
