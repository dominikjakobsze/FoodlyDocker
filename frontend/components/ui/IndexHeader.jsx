import React from "react";
import DOMPurify from "dompurify";
import Link from "next/link";
const IndexHeader = ({ header, align = "center" }) => {
  const [headerContent, setHeaderContent] = React.useState(() => "");
  React.useEffect(() => {
    setHeaderContent((prev) => "");
    setHeaderContent((prev) => {
      return DOMPurify.sanitize(header);
    });
  }, []);
  return (
    <>
      <h1
        className={`w-full p-3 pt-1 pb-1 mb-1 mt-6 text-xl text-gray-800 font-bold text-${align}`}
      >
        {headerContent}
      </h1>
    </>
  );
};

export default IndexHeader;
