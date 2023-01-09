import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
const CitySlider = ({ cities }) => {
  return (
    <>
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className={"w-full h-full"}
      >
        {cities.map(({ city_name, imageurl }) => {
          return (
            <SwiperSlide
              key={city_name}
              className={"w-full h-full bg-red-500 relative grid grid-cols-1"}
            >
              <img
                src={"http://localhost:9600" + imageurl}
                alt={`image slide ${city_name}`}
                className={"w-full h-full object-cover"}
              />
              <h2
                className={
                  "place-self-center absolute z-20 text-3xl text-gray-50"
                }
              >
                {city_name}
              </h2>
              <div
                className={
                  "w-full h-full bg-gray-900 opacity-60 z-10 absolute place-items-center"
                }
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};
export default CitySlider;
