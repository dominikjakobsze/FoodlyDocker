import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import ModalMessageContext from "../../context/ModalMessageContext";
import { getCookie } from "cookies-next";

export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const paramId = context.params.menuId;
  const access = await useCheckRoleSSR("admin-owner");
  const dish = await axios.get(
    "http://app-backend-foodly:8000/menu/" + paramId
  );
  return {
    props: {
      dish: dish.data,
      access: access.data,
    },
  };
};
const menuUpdate = ({ access, dish }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (access?.status === 401) {
      router.push("/login");
    }
    if (access?.status === 403 || dish?.accepted === false) {
      router.push("/");
    }
  }, []);
  if (
    access?.status === 401 ||
    access?.status === 403 ||
    dish?.accepted === false
  ) {
    return null;
  }
  const [about, setAbout] = React.useState(dish?.result?.about);
  const [name, setName] = React.useState(dish?.result?.name);
  const [file, setFile] = React.useState(null);
  const [price, setPrice] = React.useState(dish?.result?.price);
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const handleSubmit = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("about", about);
    bodyFormData.append("image", file);
    bodyFormData.append("price", price);
    axios
      .post("http://localhost:9600/menu/" + dish?.result?.id, bodyFormData, {
        headers: {
          authtoken: getCookie("authtoken"),
        },
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
            content: "Zmieniono potrawę",
          }));
          setOpenModalMessage(true);
        }
        console.log(res.data);
      });
  };
  return (
    <>
      <UserHeaderApp />
      <div className={"p-3 w-full grid grid-cols-1 place-items-center"}>
        {dish?.result != null && dish?.accepted !== false ? (
          <div
            className={
              "w-full p-3 grid grid-cols-1 place-items-center gap-5 mt-10"
            }
          >
            <div
              className={
                "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
              }
            >
              <input
                type="text"
                className={"w-full bg-transparent p-2"}
                placeholder={"nazwa potrawy"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div
              className={
                "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
              }
            >
              <input
                type="number"
                className={"w-full bg-transparent p-2"}
                placeholder={"cena"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div
              className={
                "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
              }
            >
              <textarea
                className={"w-full bg-transparent p-2"}
                placeholder={"o potrawie"}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
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
                placeholder={"adres"}
                onChange={(e) => setFile(() => e.target.files[0])}
              />
            </div>
            <button
              className={
                "hover:bg-red-500 bg-red-400 place-self-center py-2 px-8 rounded-lg text-gray-50 font-bold elevation-3 mb-4"
              }
              onClick={() => handleSubmit()}
            >
              Edytuj Potrawę
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default menuUpdate;
