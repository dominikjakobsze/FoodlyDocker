import LayoutContainer from "../components/ui/LayoutContainer";
import CitySlider from "../components/city_slider/CitySlider";
import CoverImage from "../public/img/cover.jpg";
import LoginForm from "../components/forms/LoginForm";
import axios from "axios";
import { getCookie } from "cookies-next";
export const getServerSideProps = async (context) => {
  const cities = await axios.get("http://app-backend-foodly:8000/city");
  const { req, res } = context;
  return {
    props: { cities: cities.data },
  };
};
const login = ({ cities, token }) => {
  return (
    <>
      <LayoutContainer>
        <div
          className={
            "grid grid-cols-1 md:grid-cols-2 h-full min-h-screen gap-10 mt-10 md:gap-0 md:mt-0"
          }
        >
          <div
            className={
              "w-full flex flex-col items-center gap-5 text-gray-800 p-3 place-self-center"
            }
          >
            <div
              className={
                "w-full h-[60px] relative flex flex-col items-center justify-center overflow-hidden rounded-lg"
              }
            >
              <div
                className={"bg-gray-900 opacity-60 w-full h-full absolute"}
              ></div>
              <img
                src={CoverImage.src}
                alt={"cover_image_food_dishes_plates"}
                className={"w-full h-full object-cover"}
              />
              <h1
                className={
                  "absolute text-red-500 font-bold text-5xl tracking-tighter"
                }
              >
                Foodly
              </h1>
            </div>
            <div className={"w-full grid grid-cols-1 gap-5"}>
              <LoginForm />
            </div>
          </div>
          <div className={"min-h-[400px] md:min-h-[10px]"}>
            <CitySlider cities={cities?.result} />
          </div>
        </div>
      </LayoutContainer>
    </>
  );
};
export default login;

// const { data, isLoading, isError } = useQuery(
//     "cities",
//     () => {
//         return axios.get("http://localhost:3900/cities");
//     },
//     {
//         cacheTime: 0,
//         staleTime: 0,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//     }
// );
