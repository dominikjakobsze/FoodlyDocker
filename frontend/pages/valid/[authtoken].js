import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  const { authtoken } = params;
  setCookie("authtoken", authtoken, { req, res, maxAge: 60 * 6 * 24 });

  return {
    props: {
      authtokenParam: authtoken,
      authtokenCookie: getCookie("authtoken", { req, res }),
    },
  };
};
const valid = ({ authtokenParam, authtokenCookie }) => {
  const router = useRouter();
  React.useEffect(() => {
    router.push("/");
  }, []);
  return <>redirect</>;
};
export default valid;
