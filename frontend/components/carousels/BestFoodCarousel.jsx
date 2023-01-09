import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper";
const BestFoodCarousel = ({ topFood }) => {
  return (
    <>
      <div className={"p-3"}>
        <Swiper
          direction={"vertical"}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className={"w-full h-[500px] bg-gray-100 mt-3"}
        >
          {topFood.map(({ food_name, id, image }) => (
            <SwiperSlide
              key={id}
              className={
                "w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-3 p-3"
              }
            >
              <div className={"flex flex-col items-center justify-center"}>
                <img
                  src={image}
                  alt={food_name}
                  className={
                    "max-h-[260px] w-full sm:max-h-[1500px] sm:h-full object-contain"
                  }
                />
              </div>
              <div
                className={
                  "flex flex-col gap-4 justify-center items-start text-gray-800"
                }
              >
                <div
                  className={
                    "flex flex-row items-center gap-3 cursor-pointer hover:text-red-500"
                  }
                >
                  <img
                    src={"https://picsum.photos/800"}
                    className={"w-10 h-10 object-cover rounded-full"}
                    alt={"food_owner"}
                  />
                  <h3>Dominik Jakobsze</h3>
                </div>
                <h1 className={"text-center text-3xl font-bold w-full"}>
                  {food_name}
                </h1>
                <h2 className={"cursor-pointer hover:text-red-500"}>
                  Dostępne w: Restauracja 1
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default BestFoodCarousel;
