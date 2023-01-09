import React from "react";

const LayoutContainer = ({ children }) => {
  return (
    <div
      className={"w-full flex flex-col items-center bg-gray-50 overflow-hidden"}
    >
      <div className={"w-full max-w-[1450px]"}>{children}</div>
    </div>
  );
};
export default LayoutContainer;
