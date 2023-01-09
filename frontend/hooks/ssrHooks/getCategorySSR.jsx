import axios from "axios";
import { getCookie } from "cookies-next";

export const getCategorySSR = async ($id) => {
  return await axios.get("http://app-backend-foodly:8000/category/" + $id);
};
