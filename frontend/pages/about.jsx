import React from "react";
import Head from "next/head";
const about = ({ role = "admin" }) => {
  return (
    <>
      <Head>
        <title>About</title>
        <meta name={"description"} content={"About page"} />
      </Head>
      <div>Hi!</div>
    </>
  );
};

export default about;
