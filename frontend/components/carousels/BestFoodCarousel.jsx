import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper";
import Link from "next/link";
const BestFoodCarousel = ({ topFood }) => {
  /*
    * dish_image
:
"/image/dishes/d3.jpg"
dish_name
:
"magni"
restaurant_id
:
221
restaurant_name
:
"Kuphal, Johnston and Collins"
user_email
:
"zoe.connelly@mosciski.com"
user_image
:
"/image/avatars/avatar.png"
    * */
  return (
    <>
      <div className={"p-3"}>
        <Swiper
          direction={"vertical"}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className={"w-full h-[500px] bg-gray-100"}
        >
          {topFood.map(
            ({
              dish_image,
              dish_name,
              restaurant_id,
              user_email,
              user_image,
              restaurant_name,
            }) => (
              <SwiperSlide
                key={dish_image + dish_name + restaurant_id}
                className={
                  "w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden"
                }
              >
                <div className={"flex flex-col items-center justify-center"}>
                  <img
                    src={"http://localhost:9600" + dish_image}
                    alt={dish_name}
                    className={
                      "max-h-[260px] w-full sm:max-h-[450px] sm:h-full object-contain"
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
                      "flex flex-row items-center gap-3 cursor-pointer"
                    }
                  >
                    <img
                      src={"http://localhost:9600" + user_image}
                      className={"w-10 h-10 object-cover rounded-full"}
                      alt={user_email}
                    />
                    <h3>{user_email}</h3>
                  </div>
                  <h1 className={"text-center text-3xl font-bold w-full"}>
                    {dish_name}
                  </h1>
                  <Link href={"/restaurant/" + restaurant_id}>
                    <h2 className={"cursor-pointer hover:text-red-500"}>
                      Dostępne w: {restaurant_name}
                    </h2>
                  </Link>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
    </>
  );
};

export default BestFoodCarousel;
