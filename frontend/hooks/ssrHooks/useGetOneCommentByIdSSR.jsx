import axios from "axios";

export const useGetOneCommentByIdSSR = async ($id) => {
  return await axios.get("http://app-backend-foodly:8000/comment/get/" + $id);
};

export default useGetOneCommentByIdSSR;
