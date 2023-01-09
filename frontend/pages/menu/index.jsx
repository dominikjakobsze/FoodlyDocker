import { useRouter } from "next/router";
import React from "react";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import axios from "axios";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import ModalMessageContext from "../../context/ModalMessageContext";
import Link from "next/link";
import { getCookie } from "cookies-next";
export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin-owner");
  const menu = await axios.get("http://app-backend-foodly:8000/menu");
  return {
    props: {
      access: access.data,
      menu: menu.data,
    },
  };
};
const menu = ({ access, menu }) => {
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
  const [about, setAbout] = React.useState("");
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [price, setPrice] = React.useState("");
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const handleSubmit = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("name", name);
    bodyFormData.append("about", about);
    bodyFormData.append("image", file);
    bodyFormData.append("price", price);
    axios
      .post("http://localhost:9600/menu", bodyFormData, {
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
            content: "Dodano potrawę",
          }));
          setOpenModalMessage(true);
        }
        console.log(res.data);
      });
  };
  console.log(menu);
  return (
    <>
      <UserHeaderApp />
      <div
        className={"w-full p-3 grid grid-cols-1 place-items-center gap-5 mt-10"}
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
          Dodaj Potrawę
        </button>
        {menu?.result != null &&
        menu?.result?.length > 0 &&
        menu?.accepted === true
          ? menu.result.map((dish) => (
              <div
                key={dish.imageurl + dish.id}
                className={
                  "w-full grid grid-cols-1 place-items-center text-gray-800 mt-4 mb-4 gap-3 elevation-3 p-2"
                }
              >
                <img
                  src={"http://localhost:9600" + dish.imageurl}
                  alt={dish.name}
                  className={"w-full max-h-[350px] object-contain"}
                />
                <h1>{dish.name + " " + dish.price + "zł"}</h1>
                <p>{dish.about}</p>
                <Link href={"/menu/" + dish.id}>
                  <p className={"text-red-500"}>Edytuj</p>
                </Link>
                <p
                  className={"text-red-500 cursor-pointer"}
                  onClick={() =>
                    axios
                      .delete("http://localhost:9600/menu/" + dish.id)
                      .then((res) => {
                        console.log(res.data);
                      })
                  }
                >
                  Usuń
                </p>
              </div>
            ))
          : null}
      </div>
    </>
  );
};
export default menu;
