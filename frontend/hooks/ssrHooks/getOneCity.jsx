import axios from "axios";
import { getCookie } from "cookies-next";
export const getOneCity = async (cityId) => {
  return await axios.get("http://app-backend-foodly:8000/city/" + cityId);
};
