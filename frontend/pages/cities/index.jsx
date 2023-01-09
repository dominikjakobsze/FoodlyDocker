import React from "react";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import Link from "next/link";
import axios from "axios";
import { useGetAllCitiesSSR } from "../../hooks/ssrHooks/useGetAllCitiesSSR";
import { getCookie } from "cookies-next";
import ModalMessageContext from "../../context/ModalMessageContext";
export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin");
  const cities = await useGetAllCitiesSSR();
  return {
    props: {
      access: access.data,
      cities: cities.data,
    },
  };
};
const cities = ({ access, cities }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403) {
      router.push("/");
    }
  }, []);
  if (access?.status === 401 || access?.status === 403) return null;
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const handleDelete = (id) => {
    axios.delete("http://localhost:9600/city/" + id, {
      headers: { authtoken: getCookie("authtoken") },
    });
  };
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState(null);
  const handleSubmit = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("city_name", name);
    bodyFormData.append("city_image", file);
    axios
      .post("http://localhost:9600/city", bodyFormData, {
        headers: { authtoken: getCookie("authtoken") },
      })
      .then((res) => {
        if (res?.data?.accepted === false) {
          setContentModalMessage({
            title: "Oops!",
            content: res?.data?.result,
          });
        } else {
          setContentModalMessage({
            title: "Ok!",
            content: "Dodano miasto",
          });
        }
        setOpenModalMessage(true);
      });
  };
  return (
    <>
      <UserHeaderApp />
      <div className={"w-full p-3 flex-col flex-wrap flex gap-4 mt-10 mb-5"}>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <input
            type="text"
            className={"w-full bg-transparent p-2"}
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder={"Nazwa miasta"}
          />
        </div>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <input
            type="file"
            className={"w-full bg-transparent p-2"}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          className={
            "hover:bg-red-500 bg-red-400 place-self-center py-2 px-8 rounded-lg text-gray-50 font-bold elevation-3"
          }
          onClick={() => handleSubmit()}
        >
          Dodaj Miasto
        </button>
      </div>
      {access?.accepted && (
        <div className={"w-full p-3 mt-10 flex flex-col gap-5 mb-5"}>
          <h1 className={"w-full text-gray-800 text-2xl"}>Miasta:</h1>
          <div
            className={
              "w-full grid grid-cols-1 gap-8 mt-10 text-gray-800 text-normal"
            }
          >
            {cities?.result?.length === 0
              ? null
              : cities.result.map((city) => (
                  <div
                    key={city.city_name + Math.random()}
                    className={"w-full grid grid-cols-1 gap-1 elevation-4 p-3"}
                  >
                    <h2 className={"w-full text-gray-800"}>
                      Treść: {city.city_name}
                    </h2>
                    <div className={"w-full flex flex-row gap-3 text-gray-400"}>
                      <Link href={"/cities/" + city.id}>
                        <p className={"hover:text-red-500 cursor-pointer"}>
                          Edytuj
                        </p>
                      </Link>
                      <p
                        className={"hover:text-red-500 cursor-pointer"}
                        onClick={() => handleDelete(city.id)}
                      >
                        Usuń
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </>
  );
};
export default cities;
