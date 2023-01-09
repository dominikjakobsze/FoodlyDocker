import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import Link from "next/link";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin-user-owner");
  const restaurants = await axios.get(
    "http://app-backend-foodly:8000/restaurant-by-category/" + params.categoryId
  );
  return {
    props: {
      restaurants: restaurants.data,
      access: access.data,
    },
  };
};
const restaurantsByCategory = ({ access, restaurants }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403 || restaurants?.result?.length === 0) {
      router.push("/");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    restaurants?.result?.length === 0
  )
    return null;
  return (
    <>
      <UserHeaderApp />
      <div
        className={
          "p-3 w-full grid grid-cols-1 sm:grid-cols-2 place-items-center gap-3 mt-10 text-gray-800"
        }
      >
        {restaurants.result.map((restaurant) => (
          <div
            key={restaurant.restaurant_name}
            className={"grid grid-cols-1 place-items-center gap-3"}
          >
            <div
              className={
                "w-full h-[240px] sm:h-[400px] overflow-hidden rounded-xl"
              }
            >
              <img
                src={"http://localhost:9600" + restaurant.restaurant_image}
                alt={restaurant.restaurant_name}
                className={"w-full object-cover"}
              />
            </div>
            <Link href={`/restaurant/${restaurant.restaurant_id}`}>
              <h1 className={"text-2xl hover:text-red-500"}>
                {restaurant.restaurant_name}
              </h1>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
export default restaurantsByCategory;
