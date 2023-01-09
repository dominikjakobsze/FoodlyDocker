import UserHeaderApp from "../../components/ui/UserHeaderApp";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useGetUsers } from "../../hooks/ssrHooks/useGetUsers";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin");
  const users = await useGetUsers();
  return {
    props: {
      access: access.data,
      users: users.data,
    },
  };
};
const users = ({ users, access }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403) {
      router.push("/");
    }
    if (typeof users.result === "string") {
      router.push("/profile");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    typeof users.result === "string"
  )
    return null;
  return (
    <>
      <UserHeaderApp />
      <div className={"w-full grid grid-cols-1 gap-3 p-3 mt-10"}>
        {users?.result != null &&
        users?.accepted === true &&
        users?.result.length > 0
          ? users.result.map((user) => (
              <div
                key={user.id + user.email}
                className={
                  "flex flex-row items-center text-gray-700 text-normal font-normal p-1 gap-1 elevation-4 flex-wrap justify-center sm:justify-start"
                }
              >
                <img
                  src={"http://localhost:9600" + user.imageurl}
                  alt={user.id + user.email}
                  className={"w-10 h-10 object-contain rounded-full"}
                />
                <p
                  className={
                    "sm:flex-[0_0_30%] flex-[0_0_100%] text-center sm:text-start"
                  }
                >
                  {user.email}
                </p>
                <p className={"sm:flex-[0_0_15%] flex-[0_0_100%] text-center"}>
                  {user.role}
                </p>
                <div
                  className={
                    "sm:flex-[0_0_30%] flex-[0_0_100%] flex flex-row flex-wrap gap-1 justify-center"
                  }
                >
                  <p
                    className={"cursor-pointer hover:text-red-500"}
                    onClick={() => {
                      axios.delete(
                        "http://localhost:9600/userauth/" + user.id,
                        { headers: { authtoken: getCookie("authtoken") } }
                      );
                    }}
                  >
                    Usuń
                  </p>
                  <p
                    className={"cursor-pointer hover:text-red-500"}
                    onClick={() => {
                      axios.get(
                        "http://localhost:9600/userauth/role/" +
                          user.id +
                          "/owner",
                        { headers: { authtoken: getCookie("authtoken") } }
                      );
                    }}
                  >
                    Owner
                  </p>
                  <p
                    className={"cursor-pointer hover:text-red-500"}
                    onClick={() => {
                      axios.get(
                        "http://localhost:9600/userauth/role/" +
                          user.id +
                          "/admin",
                        { headers: { authtoken: getCookie("authtoken") } }
                      );
                    }}
                  >
                    Admin
                  </p>
                  <p
                    className={"cursor-pointer hover:text-red-500"}
                    onClick={() => {
                      axios.get(
                        "http://localhost:9600/userauth/role/" +
                          user.id +
                          "/user",
                        { headers: { authtoken: getCookie("authtoken") } }
                      );
                    }}
                  >
                    User
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
};
export default users;
/* /userauth/role/{id}/{role} */
