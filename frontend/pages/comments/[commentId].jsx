import useGetOneCommentByIdSSR from "../../hooks/ssrHooks/useGetOneCommentByIdSSR";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import UpdateCommentForm from "../../components/forms/UpdateCommentForm";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const paramId = context.params.commentId;
  const retrievedComment = await useGetOneCommentByIdSSR(paramId);
  const access = await useCheckRoleSSR("admin-user-owner");
  return {
    props: {
      retrievedComment: retrievedComment.data,
      access: access.data,
    },
  };
};
const editComment = ({ access, retrievedComment }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403 || retrievedComment?.accepted === false) {
      router.push("/");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    retrievedComment?.accepted === false
  ) {
    return null;
  }
  console.log(retrievedComment);
  return (
    <>
      <UserHeaderApp />
      <UpdateCommentForm
        commentId={retrievedComment?.result.id}
        commentContent={retrievedComment?.result.content}
      />
    </>
  );
};

export default editComment;
