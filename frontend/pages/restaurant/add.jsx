import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import ModalMessageContext from "../../context/ModalMessageContext";
import axios from "axios";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin-owner");
  const categories = await axios.get("http://app-backend-foodly:8000/category");
  const cities = await axios.get("http://app-backend-foodly:8000/city");
  return {
    props: {
      access: access.data,
      categories: categories.data,
      cities: cities.data,
    },
  };
};
const addRestaurant = ({ access, categories, cities }) => {
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const handleSubmit = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("introduction", introduction);
    bodyFormData.append("image", file);
    bodyFormData.append("address", address);
    bodyFormData.append("openclose", openclose);
    bodyFormData.append("category", category);
    bodyFormData.append("city", city);
    axios
      .post("http://localhost:9600/restaurant", bodyFormData, {
        headers: { authtoken: getCookie("authtoken") },
      })
      .then((res) => {
        if (res?.data?.status === 401) {
          router.push("/login");
        }
        if (res?.data?.status === 403 || res?.data?.accepted === false) {
          setContentModalMessage((prev) => ({
            title: "Oops!",
            content: res?.data?.result,
          }));
          setOpenModalMessage(true);
        } else {
          setContentModalMessage((prev) => ({
            title: "Ok!",
            content: "Dodano restauracje",
          }));
          setOpenModalMessage(true);
        }
        console.log(res.data);
      });
  };
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403) {
      router.push("/");
    }
    if (
      cities?.result === null ||
      categories?.result === null ||
      cities?.result?.length === 0 ||
      categories?.result?.length === 0 ||
      typeof cities?.result === "string" ||
      typeof categories?.result === "string" ||
      cities?.result?.accepted === false ||
      categories?.result?.accepted === false
    ) {
      router.push("/profile");
    }
  }, []);
  if (access?.status === 401 || access?.status === 403) return null;
  const [name, setName] = React.useState("");
  const [introduction, setIntroduction] = React.useState("");
  const [openclose, setOpenclose] = React.useState("");
  const [address, setaddress] = React.useState("");
  const [file, setFile] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [city, setCity] = React.useState("");
  return (
    <>
      <UserHeaderApp />
      <div
        className={"w-full p-3 flex-col flex-wrap flex gap-4 mt-10 mb-5 p-3"}
      >
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <input
            type="text"
            className={"w-full bg-transparent p-2"}
            placeholder={"nazwa restauracji"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <textarea
            className={"w-full bg-transparent p-2"}
            placeholder={"opis restauracji"}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <input
            type="text"
            className={"w-full bg-transparent p-2"}
            placeholder={"godziny otwarcia"}
            value={openclose}
            onChange={(e) => setOpenclose(e.target.value)}
          />
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <input
            type="text"
            className={"w-full bg-transparent p-2"}
            placeholder={"adres"}
            value={address}
            onChange={(e) => setaddress(e.target.value)}
          />
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <select
            onChange={(e) => setCategory(e.target.value)}
            className={"w-full bg-transparent p-2"}
          >
            {categories?.result?.map((category) => (
              <option
                value={category.id}
                key={category.id + category.category_name}
              >
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <select
            onChange={(e) => setCity(e.target.value)}
            className={"w-full bg-transparent p-2"}
          >
            {cities?.result?.map((city) => (
              <option value={city.id} key={city.id + city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <input
            type="file"
            className={"w-full bg-transparent p-2"}
            placeholder={"adres"}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          className={
            "hover:bg-red-500 bg-red-400 place-self-center py-2 px-8 rounded-lg text-gray-50 font-bold elevation-3"
          }
        >
          Dodaj Restauracje
        </button>
      </div>
    </>
  );
};
export default addRestaurant;
