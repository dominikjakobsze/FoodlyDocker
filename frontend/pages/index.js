import Head from "next/head";
import UserHeaderApp from "../components/ui/UserHeaderApp";
import IndexHeader from "../components/ui/IndexHeader";
import BestRestaurantsCarousel from "../components/carousels/BestRestaurantsCarousel";
import { useGetTopTenRestaurantsSSR } from "../hooks/ssrHooks/useGetTopTenRestaurantsSSR";
import IndexSubHeader from "../components/ui/IndexSubHeader";
import JoinToCallout from "../components/ui/JoinToCallout";
import LocalTypes from "../components/action/LocalTypes";
import { useGetLocalTypesSSR } from "../hooks/ssrHooks/useGetLocalTypesSSR";
import BestFoodCarousel from "../components/carousels/BestFoodCarousel";
import UsersShow from "../components/info/UsersShow";
import { useCheckRoleSSR } from "../hooks/ssrHooks/useCheckRoleSSR";
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
  const access = await useCheckRoleSSR("admin-user-owner");
  const topRestaurants = await useGetTopTenRestaurantsSSR();
  const localTypes = await useGetLocalTypesSSR();
  const topFood = await axios.get("http://app-backend-foodly:8000/newest");
  const usersShow = await axios.get("http://app-backend-foodly:8000/user/all");
  return {
    props: {
      topRestaurants: topRestaurants.data,
      localTypes: localTypes.data,
      access: access.data,
      topFood: topFood.data,
      usersShow: usersShow.data,
    },
  };
};
export default function Home({
  topRestaurants,
  localTypes,
  access,
  topFood,
  usersShow,
}) {
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
      <Head>
        <title>Foodly</title>
        <meta name="description" content="Homepage of Foodly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserHeaderApp />
      <IndexHeader header={"Wyj??tkowe miejsca"} align={"start"} />
      <IndexSubHeader align={"start"}>
        Miejsca, kt??re was zachwyci??y. Wyr????nione przez was restauracje.
      </IndexSubHeader>
      <BestRestaurantsCarousel restaurants={topRestaurants} />
      <IndexHeader
        header={"Spotkanie ze znajomymi? Biznesowe? A mo??e na szybko?"}
        align={"start"}
      />
      <IndexSubHeader align={"start"}>
        Foodly zapewnia pe??n?? profesjonalno???? je??li chodzi o rodzaj restauracji.
        Ka??da z nich jest sprawdzana na podstawie dostarczanych dokument??w przez
        restauratora i klasyfikowana na podstawie tego jakie posiada certyfikaty
        wed??ug skalii europejskiej. Nie wymagamy od restaurator??w ??adnych
        dodatkowych dokument??w w przypadku kategorii 'fast food' i
        'restauracja'.
      </IndexSubHeader>
      <LocalTypes localTypes={localTypes} />
      <IndexHeader header={"Najnowsze propozycje"} align={"start"} />
      <IndexSubHeader align={"start"}>
        Sprawd?? najnowsze pozycje na naszej stronie.
      </IndexSubHeader>
      <BestFoodCarousel topFood={topFood?.result} />
      <IndexHeader
        header={"Platforma Foodly to spo??eczno????!"}
        align={"start"}
      />
      <IndexSubHeader align={"start"}>
        Foodly to ludzie! Pami??tajmy o tym! A jak to wygl??da w liczbach?
        Przekonajcie si?? sami :)
      </IndexSubHeader>
      <UsersShow usersShow={usersShow.result} />
      <IndexHeader header={"Jeste?? restauratorem?"} align={"start"} />
      <IndexSubHeader align={"start"}>
        Foodly to platforma, kt??ra zrzesza restaurator??w i klient??w. Dzi??ki
        czemu klienci otrzymuj?? mo??liwo???? szybkiego i ??atwego wyboru miejsca, a
        restauratorzy dostaj?? mo??liwo???? ??atwej promocji i szybkiego skalowania
        biznesu. Je??li jeste?? restauratorem i chcesz si?? z nami zintegrowa??, to
        sprawd?? jak to zrobi??!
      </IndexSubHeader>
      <JoinToCallout />
    </>
  );
}
