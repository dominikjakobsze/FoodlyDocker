import React from "react";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import Link from "next/link";
import axios from "axios";
import { useGetAllCitiesSSR } from "../../hooks/ssrHooks/useGetAllCitiesSSR";
import { getCookie } from "cookies-next";
export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin");
  const cities = await useGetAllCitiesSSR();
  return {
    props: {
      access: access.data,
      cities: cities.data,
    },
  };
};
const cities = ({ access, cities }) => {
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
  const handleDelete = (id) => {
    axios.delete("http://localhost:9600/city/" + id, {
      headers: { authtoken: getCookie("authtoken") },
    });
  };
  return (
    <>
      <UserHeaderApp />
      {access?.accepted && (
        <div className={"w-full p-3 mt-10 flex flex-col gap-5 mb-5"}>
          <h1 className={"w-full text-gray-800 text-2xl"}>Miasta:</h1>
          <div
            className={
              "w-full grid grid-cols-1 gap-8 mt-10 text-gray-800 text-normal"
            }
          >
            {cities?.result?.length === 0
              ? null
              : cities.result.map((city) => (
                  <div
                    key={city.city_name + Math.random()}
                    className={"w-full grid grid-cols-1 gap-1 elevation-4 p-3"}
                  >
                    <h2 className={"w-full text-gray-800"}>
                      Treść: {city.city_name}
                    </h2>
                    <div className={"w-full flex flex-row gap-3 text-gray-400"}>
                      <Link href={"/cities/" + city.id}>
                        <p className={"hover:text-red-500 cursor-pointer"}>
                          Edytuj
                        </p>
                      </Link>
                      <p
                        className={"hover:text-red-500 cursor-pointer"}
                        onClick={() => handleDelete(city.id)}
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
export default cities;
