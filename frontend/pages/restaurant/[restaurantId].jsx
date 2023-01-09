import Head from "next/head";
import { useGetOneRestaurantById } from "../../hooks/ssrHooks/useGetOneRestaurantById";
import React from "react";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import IndexHeader from "../../components/ui/IndexHeader";
import IndexSubHeader from "../../components/ui/IndexSubHeader";
import RestaurantDetails from "../../components/ui/RestaurantDetails";
import RestaurantMenu from "../../components/ui/RestaurantMenu";
import RestaurantComments from "../../components/ui/RestaurantComments";
import AddComment from "../../components/forms/AddComment";
import { useRouter } from "next/router";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const paramId = context.params.restaurantId;
  const retrievedRestaurant = await useGetOneRestaurantById(paramId);
  const access = await useCheckRoleSSR("admin-user-owner");
  return {
    props: {
      retrievedRestaurant: retrievedRestaurant.data,
      access: access.data,
    },
  };
};
/**
 *
 * @param restaurantId
 * @param retrievedRestaurant.result.restaurant
 * @param retrievedRestaurant.result.restaurant[].introduction
 * @param retrievedRestaurant.result.restaurant[].menus
 * @param retrievedRestaurant
 * @param retrievedRestaurant.status
 * @returns {JSX.Element}
 */
export default function dynamicRestaurant({ retrievedRestaurant, access }) {
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
  if (retrievedRestaurant.status === 401) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-3xl">Please Login First</h1>
      </div>
    );
  }
  if (
    retrievedRestaurant?.result?.length === 0 ||
    typeof retrievedRestaurant?.result === "string"
  ) {
    return (
      <>
        <div
          className={
            "w-full h-screen grid grid-cols-1 place-items-center bg-gray-800 text-gray-50 text-3xl"
          }
        >
          404
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>{retrievedRestaurant?.result?.restaurant[0]?.name}</title>
        <meta name="description" content="Homepage of Foodly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserHeaderApp />
      <IndexHeader
        header={retrievedRestaurant?.result?.restaurant[0]?.name}
        align={"start"}
      />
      <IndexSubHeader align={"start"}>
        {retrievedRestaurant?.result?.restaurant[0]?.introduction}
      </IndexSubHeader>
      {retrievedRestaurant?.result?.restaurant[0]?.restaurant?.length ===
      0 ? null : (
        <RestaurantDetails
          restaurant={retrievedRestaurant?.result?.restaurant[0]}
        />
      )}
      {retrievedRestaurant?.result?.menus?.length === 0 ? null : (
        <RestaurantMenu menus={retrievedRestaurant?.result?.menus} />
      )}
      <AddComment
        restaurantId={retrievedRestaurant?.result?.restaurant[0]?.id}
      />
      {retrievedRestaurant?.result?.comments?.length === 0 ? null : (
        <RestaurantComments comments={retrievedRestaurant?.result?.comments} />
      )}
    </>
  );
}
