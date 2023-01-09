import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/scrollbar";

import { Scrollbar } from "swiper";
const LocalTypes = ({ localTypes }) => {
  if (localTypes.status === 401) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-3xl">Please Login First</h1>
      </div>
    );
  }
  if (localTypes?.result?.length === 0) {
    return <></>;
  }
  return (
    <>
      <div className={"w-full px-2 sm:px-10 py-4"}>
        <Swiper
          scrollbar={{
            hide: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.65,
              spaceBetween: 10,
            },
            600: {
              slidesPerView: 2.15,
              spaceBetween: 10,
            },
            1000: {
              slidesPerView: 3.2,
              spaceBetween: 30,
            },
            1300: {
              slidesPerView: 4.2,
              spaceBetween: 50,
            },
          }}
          modules={[Scrollbar]}
          className={"w-full text-gray-50"}
        >
          {localTypes?.result?.map(({ category_name, id }) => {
            return (
              <SwiperSlide
                key={id}
                className={"p-5 mb-5 grid grid-cols-1 place-items-center"}
              >
                <motion.p
                  whileHover={{
                    scale: 1.1,
                  }}
                  className={
                    "bg-gray-800 px-8 py-1 rounded-full cursor-pointer"
                  }
                >
                  {category_name}
                </motion.p>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default LocalTypes;
