import axios from "axios";

export const useGetAllCommentsByUserSSR = async () => {
  return await axios.get("http://app-backend-foodly:8000/comment/user");
};
