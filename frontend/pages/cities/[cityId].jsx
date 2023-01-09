import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import { getOneCity } from "../../hooks/ssrHooks/getOneCity";
import UpdateCityForm from "../../components/forms/UpdateCityForm";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const paramId = context.params.cityId;
  const city = await getOneCity(paramId);
  const access = await useCheckRoleSSR("admin");
  return {
    props: {
      city: city.data,
      access: access.data,
    },
  };
};
const editCity = ({ access, city }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403 || city?.accepted === false) {
      router.push("/");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    city?.accepted === false
  ) {
    return null;
  }
  return (
    <>
      <UserHeaderApp />
      <UpdateCityForm
        cityId={city?.result[0]?.id}
        cityName={city?.result[0]?.city_name}
      />
    </>
  );
};

export default editCity;
