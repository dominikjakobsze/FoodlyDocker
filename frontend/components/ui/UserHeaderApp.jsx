import { useQuery } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";

const UserHeaderApp = () => {
  const data = useQuery(
    "user",
    () => {
      return axios.get("http://localhost:9600/userauth/admin-owner-user", {
        headers: {
          authtoken: getCookie("authtoken"),
        },
      });
    },
    {
      enabled: true,
      cacheTime: 0,
      staleTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );
  const router = useRouter();
  if (data?.status === "error") {
    router.push("/login");
  }
  if (data?.data?.data?.status === 401 || data?.data?.data?.status === 403) {
    router.push("/login");
  }
  if (data?.isLoading === true) {
    return <></>;
  }
  if (data?.data?.data?.status === 401 || data?.data?.data?.status === 403)
    return null;
  return (
    <>
      <div className={"grid grid-cols-1 p-3 gap-1 mt-5"}>
        <h3 className={"w-full text-slate-400 text-normal"}>
          Hej! Co dzisiaj jemy?
        </h3>
        <div
          className={
            "w-full flex flex-row flex-wrap flex-[0_1_auto] text-3xl font-bold tracking-widest text-gray-800 items-center gap-5"
          }
        >
          <h1 className={"cursor-pointer hover:text-red-500"}>
            <Link href={"/profile"}>{data?.data?.data?.result?.email}</Link>
          </h1>
          <img
            src={"http://localhost:9600" + data?.data?.data?.result?.imageurl}
            alt="avatar"
            className={"w-10 h-10 object-cover rounded-full cursor-pointer"}
          />
        </div>
      </div>
    </>
  );
};
export default UserHeaderApp;
