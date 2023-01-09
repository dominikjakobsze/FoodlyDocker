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
  return {
    props: {
      topRestaurants: topRestaurants.data,
      localTypes: localTypes.data,
      access: access.data,
    },
  };
};
export default function Home({ topRestaurants, localTypes, access }) {
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
      <IndexHeader header={"Wyjątkowe miejsca"} align={"start"} />
      <IndexSubHeader align={"start"}>
        Miejsca, które was zachwyciły. Wyróżnione przez was restauracje.
      </IndexSubHeader>
      <BestRestaurantsCarousel restaurants={topRestaurants} />
      <IndexHeader
        header={"Spotkanie ze znajomymi? Biznesowe? A może na szybko?"}
        align={"start"}
      />
      <IndexSubHeader align={"start"}>
        Foodly zapewnia pełną profesjonalność jeśli chodzi o rodzaj restauracji.
        Każda z nich jest sprawdzana na podstawie dostarczanych dokumentów przez
        restauratora i klasyfikowana na podstawie tego jakie posiada certyfikaty
        według skalii europejskiej. Nie wymagamy od restauratorów żadnych
        dodatkowych dokumentów w przypadku kategorii 'fast food' i
        'restauracja'.
      </IndexSubHeader>
      <LocalTypes localTypes={localTypes} />
      <IndexHeader header={"Najnowsze propozycje"} align={"start"} />
      <IndexSubHeader align={"start"}>
        Sprawdź najnowsze pozycje na naszej stronie.
      </IndexSubHeader>
      {/*<BestFoodCarousel topFood={topFood} />*/}
      <IndexHeader
        header={"Platforma Foodly to społeczność!"}
        align={"start"}
      />
      <IndexSubHeader align={"start"}>
        Foodly to ludzie! Pamiętajmy o tym! A jak to wygląda w liczbach?
        Przekonajcie się sami :)
      </IndexSubHeader>
      {/*<UsersShow usersShow={usersShow} />*/}
      <IndexHeader header={"Jesteś restauratorem?"} align={"start"} />
      <IndexSubHeader align={"start"}>
        Foodly to platforma, która zrzesza restauratorów i klientów. Dzięki
        czemu klienci otrzymują możliwość szybkiego i łatwego wyboru miejsca, a
        restauratorzy dostają możliwość łatwej promocji i szybkiego skalowania
        biznesu. Jeśli jesteś restauratorem i chcesz się z nami zintegrować, to
        sprawdź jak to zrobić!
      </IndexSubHeader>
      <JoinToCallout />
    </>
  );
}
