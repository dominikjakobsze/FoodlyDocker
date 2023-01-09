import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import { getCategorySSR } from "../../hooks/ssrHooks/getCategorySSR";
import UpdateCategoryForm from "../../components/forms/UpdateCategoryForm";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const paramId = context.params.categoryId;
  const retrievedComment = await getCategorySSR(paramId);
  const access = await useCheckRoleSSR("admin");
  return {
    props: {
      category: retrievedComment.data,
      access: access.data,
    },
  };
};
const editCategory = ({ access, category }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403 || category?.accepted === false) {
      router.push("/");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    category?.accepted === false
  ) {
    return null;
  }
  console.log(category);
  return (
    <>
      <UserHeaderApp />
      <UpdateCategoryForm
        categoryId={category?.result[0].id}
        categoryName={category?.result[0].category_name}
      />
    </>
  );
};

export default editCategory;
