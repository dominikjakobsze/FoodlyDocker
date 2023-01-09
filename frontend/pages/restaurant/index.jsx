import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import { useGetRestaurantByToken } from "../../hooks/ssrHooks/useGetRestaurantByToken";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import Link from "next/link";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin-owner");
  const restaurant = await useGetRestaurantByToken();
  return {
    props: {
      access: access.data,
      restaurant: restaurant.data,
    },
  };
};
const restaurant = ({ access, restaurant }) => {
  console.log(restaurant);
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
      <UserHeaderApp />
      <div className={"w-full p-3 grid grid-cols-1 place-items-center"}>
        <Link href={"/restaurant/add"}>
          <h1 className={"text-red-500 text-sm"}>Dodaj Restaurację</h1>
        </Link>
        {restaurant?.result != null &&
          restaurant?.result?.length > 0 &&
          restaurant?.accepted === true && (
            <div
              className={
                "w-full grid grid-cols-1 text-gray-800 place-items-center gap-5 mt-10"
              }
            >
              <Link href={"/restaurant/update"}>
                <h1 className={"text-red-500 text-sm"}>Edytuj</h1>
              </Link>
              <h1 className={"text-gray-800 text-3xl font-bold"}>
                {restaurant?.result[0].name}
              </h1>
              <img
                src={"http://localhost:9600" + restaurant?.result[0]?.imageurl}
                alt={"restaurant"}
                className={"w-full max-h-[350px] object-contain"}
              />
              <h3 className={"text-gray-800 text-xl"}>
                {restaurant?.result[0].introduction}
              </h3>
              <p>{restaurant?.result[0].address}</p>
              <p>{restaurant?.result[0].openclose}</p>
              <Link
                href={"/restaurant/" + restaurant?.result[0].id}
                className={"text-red-500 text-sm"}
              >
                Zobacz jak wygląda
              </Link>
            </div>
          )}
      </div>
    </>
  );
};
export default restaurant;
