import { motion, useInView } from "framer-motion";
import React from "react";

const UsersShow = ({ usersShow }) => {
  const [params, setParams] = React.useState(() => ({
    users: false,
    count: false,
    fixText: false,
  }));
  React.useEffect(() => {
    const width = window.innerWidth;
    setParams(() => ({
      users: usersShow.slice(0, width < 500 ? 4 : 7),
      count: usersShow.length - (width < 500 ? 4 : 7),
      fixText: width < 500 ? 3 : 6,
    }));
  }, []);
  const container = React.useRef(null);
  const isVisible = useInView(container, { once: true });
  return (
    <>
      <div className={"p-3"}>
        <div
          ref={container}
          className={
            "bg-gray-100 py-5 flex flex-row justify-center items-center text-gray-400 font-bold"
          }
        >
          {params.users !== false
            ? params.users.map(({ image, id }, index) => (
                <motion.img
                  src={image}
                  alt={id}
                  className={`w-10 h-10 rounded-full`}
                  key={id}
                  animate={
                    isVisible && { transition: { delay: 0.4 }, x: index * -20 }
                  }
                />
              ))
            : null}
          {params.count !== false && params.fixText !== false ? (
            <motion.h1
              className={"ml-3"}
              animate={
                isVisible && {
                  transition: { delay: 0.4 },
                  x: params.fixText * -20,
                }
              }
            >
              + {params.count} innych!
            </motion.h1>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default UsersShow;

// <img
//     src={users[1].image}
//     alt={users[1].id}
//     className={`w-10 h-10 rounded-full -translate-x-[20px]`}
// />
// <img
//     src={users[2].image}
//     alt={users[2].id}
//     className={`w-10 h-10 rounded-full -translate-x-[40px]`}
// />
// <img
//     src={users[3].image}
//     alt={users[3].id}
//     className={`w-10 h-10 rounded-full -translate-x-[60px]`}
// />
// <img
//     src={users[4].image}
//     alt={users[4].id}
//     className={`w-10 h-10 rounded-full -translate-x-[80px]`}
// />
