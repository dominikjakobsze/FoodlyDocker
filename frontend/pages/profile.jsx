import { useCheckRoleSSR } from "../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import ChangeUserImageForm from "../components/forms/ChangeUserImageForm";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin-user-owner");
  return {
    props: {
      access: access.data,
    },
  };
};
const profile = ({ access }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403) {
      router.push("/");
    }
  }, []);
  if (access?.status === 401 || access?.status === 403) return null;
  return (
    <>
      {access?.result != null && (
        <div
          className={
            "w-full flex flex-col items-center justify-center p-3 text-gray-800 gap-5 mt-10"
          }
        >
          <Link href={"/"}>
            <img
              src={"http://localhost:9600" + access?.result?.imageurl}
              alt={"profile-image"}
              className={"w-full max-h-[100px] object-contain cursor-pointer"}
            />
          </Link>
          <h1 className={"font-bold text-3xl"}>{access?.result?.email}</h1>
          <h1 className={"font-bold text-xl text-gray-400"}>
            {access?.result?.id}
          </h1>
          <h1 className={"font-bold text-xl text-gray-400"}>
            {access?.result?.role}
          </h1>
          <ChangeUserImageForm userId={access?.result?.id} />
          <h1 className={"font-bold text-xl text-gray-800"}>
            Dostępne opcje dla Twojego konta:
          </h1>
        </div>
      )}
      <ul
        className={
          "w-full text-gray-400 cursor-pointer p-3 flex flex-col items-center justify-center"
        }
      >
        <Link href={"http://localhost:3500/comments"}>
          <li className={"hover:text-red-500"}>Zobacz Swoje Komentarze</li>
        </Link>
        {access?.result?.role === "owner" && (
          <>
            <Link href={"http://localhost:3500/menu"}>
              <li className={"hover:text-red-500"}>Zobacz Menu</li>
            </Link>
            <Link href={"http://localhost:3500/restaurant"}>
              <li className={"hover:text-red-500"}>Zobacz Swoją Restaurację</li>
            </Link>
          </>
        )}
        {access?.result?.role === "admin" && (
          <>
            <Link href={"http://localhost:3500/categories"}>
              <li className={"hover:text-red-500"}>Zobacz Kategorie</li>
            </Link>
            <Link href={"http://localhost:3500/cities"}>
              <li className={"hover:text-red-500"}>Zobacz Miasta</li>
            </Link>
            <Link href={"http://localhost:3500/users"}>
              <li className={"hover:text-red-500"}>Zobacz Użytkowników</li>
            </Link>
          </>
        )}
      </ul>
    </>
  );
};
export default profile;
