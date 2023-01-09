import { Swiper, SwiperSlide } from "swiper/react";
import { FaHeart } from "react-icons/fa";
import React from "react";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";
const BestRestaurantsCarousel = ({ restaurants }) => {
  if (restaurants.status === 401) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-3xl">Please Login First</h1>
      </div>
    );
  }
  if (restaurants?.result?.length === 0) {
    return <></>;
  }
  return (
    <>
      <div className={"w-full p-3 grid grid-cols-1"}>
        <Swiper
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.15,
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
          modules={[Pagination]}
          className="w-full h-[500px]"
        >
          {restaurants?.result?.map(
            ({
              name,
              email,
              imageurl,
              address,
              likes,
              restaurant_id,
              restaurant_image,
              city_name,
            }) => (
              <SwiperSlide
                key={name + address + restaurant_id}
                className={`overflow-hidden rounded-3xl bg-gray-100 flex flex-col flex-wrap relative`}
              >
                <img
                  src={"http://localhost:9600" + restaurant_image}
                  alt={name}
                  className={"w-full h-full object-cover absolute z-10"}
                />
                <div
                  className={
                    "absolute h-full w-full h-full bg-gray-900 bg-opacity-50 z-20"
                  }
                />
                <div className={"w-full h-[70%] relative grid grid-cols-1"}>
                  <div className={"relative z-30 p-3 flex flex-col flex-wrap"}>
                    <div
                      className={
                        "w-full h-[10%] flex flex-row flex-wrap gap-3 items-center justify-center"
                      }
                    >
                      <FaHeart
                        className={"w-6 h-6 text-red-600 flex-initial"}
                      />
                      <p className={"flex-initial text-gray-50"}>{likes}</p>
                    </div>
                    <div
                      className={
                        "w-full mt-8 h-[35%] text-gray-50 hover:text-red-500 text-xl font-bold grid grid-cols-1 place-items-center"
                      }
                    >
                      <Link href={`/restaurant/${restaurant_id}`}>{name}</Link>
                    </div>
                    <div className={"w-full mt-8 h-[35%] grid grid-rows-2"}>
                      <p className={"place-self-end text-gray-200"}>
                        {address}
                      </p>
                      <p className={"place-self-end text-gray-200"}>
                        {city_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "w-full h-[30%] px-2 flex flex-col relative z-20 gap-4"
                  }
                >
                  <div
                    className={"w-full mt-5 flex flex-row items-center gap-3"}
                  >
                    <img
                      src={"http://localhost:9600" + imageurl}
                      alt="avatar"
                      className={"w-10 h-10 object-cover rounded-full"}
                    />
                    <p className={"text-gray-100"}>{email}</p>
                  </div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
    </>
  );
};
export default BestRestaurantsCarousel;
