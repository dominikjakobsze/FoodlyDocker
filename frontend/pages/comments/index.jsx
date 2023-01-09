import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import Link from "next/link";
import axios from "axios";
import { useGetAllCommentsByUserSSR } from "../../hooks/ssrHooks/useGetAllCommentsByUserSSR";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin-user-owner");
  const comments = await useGetAllCommentsByUserSSR();
  return {
    props: {
      access: access.data,
      comments: comments.data,
    },
  };
};
const index = ({ access, comments }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403) {
      router.push("/");
    }
    if (typeof comments.result === "string") {
      router.push("/profile");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    typeof comments.result === "string"
  )
    return null;
  const handleDeleteComment = (commentId) => {
    axios.delete("http://localhost:9600/comment/" + commentId, {
      headers: { authtoken: getCookie("authtoken") },
    });
  };
  return (
    <>
      <UserHeaderApp />
      {access?.accepted && (
        <div className={"w-full p-3 mt-10 flex flex-col gap-5 mb-5"}>
          <h1 className={"w-full text-gray-800 text-2xl"}>Twoje komentarze:</h1>
          <div
            className={
              "w-full grid grid-cols-1 gap-8 mt-10 text-gray-800 text-normal"
            }
          >
            {comments?.result?.length === 0
              ? null
              : comments.result.map((comment) => (
                  <div
                    key={comment.restaurant_name + Math.random()}
                    className={"w-full grid grid-cols-1 gap-1 elevation-4 p-3"}
                  >
                    <Link href={"/restaurant/" + comment.restaurant_id}>
                      <h1 className={"w-full text-gray-800 hover:text-red-500"}>
                        Dodany pod: {comment.restaurant_name}
                      </h1>
                    </Link>
                    <h2 className={"w-full text-gray-800"}>
                      Treść: {comment.comment_content}
                    </h2>
                    <div className={"w-full flex flex-row gap-3 text-gray-400"}>
                      <Link href={"/comments/" + comment.comment_id}>
                        <p className={"hover:text-red-500 cursor-pointer"}>
                          Edytuj
                        </p>
                      </Link>
                      <p
                        className={"hover:text-red-500 cursor-pointer"}
                        onClick={() => handleDeleteComment(comment.comment_id)}
                      >
                        Usuń
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
};
export default index;
