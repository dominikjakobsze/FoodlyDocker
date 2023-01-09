import React from "react";
import { useCheckRoleSSR } from "../../hooks/ssrHooks/useCheckRoleSSR";
import { useRouter } from "next/router";
import UserHeaderApp from "../../components/ui/UserHeaderApp";
import Link from "next/link";
import { useGetLocalTypesSSR } from "../../hooks/ssrHooks/useGetLocalTypesSSR";
import axios from "axios";
import { getCookie } from "cookies-next";
import ModalMessageContext from "../../context/ModalMessageContext";
export const getServerSideProps = async (context) => {
  const { params, req, res } = context;
  axios.defaults.headers.common["authtoken"] = getCookie("authtoken", {
    req,
    res,
  });
  const access = await useCheckRoleSSR("admin");
  const categories = await useGetLocalTypesSSR();
  return {
    props: {
      access: access.data,
      categories: categories.data,
    },
  };
};
const categories = ({ access, categories }) => {
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
  const handleDelete = (id) => {
    axios.delete("http://localhost:9600/category/" + id, {
      headers: { authtoken: getCookie("authtoken") },
    });
  };
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const [name, setName] = React.useState("");
  const handleSubmit = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("category_name", name);
    axios
      .post("http://localhost:9600/category", bodyFormData, {
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
            content: "Dodano kategorię",
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
            placeholder={"Nazwa kategorii"}
          />
        </div>
        <button
          className={
            "hover:bg-red-500 bg-red-400 place-self-center py-2 px-8 rounded-lg text-gray-50 font-bold elevation-3"
          }
          onClick={() => handleSubmit()}
        >
          Dodaj Kategorie
        </button>
      </div>
      {access?.accepted && (
        <div className={"w-full p-3 mt-10 flex flex-col gap-5 mb-5"}>
          <h1 className={"w-full text-gray-800 text-2xl"}>Kategorie:</h1>
          <div
            className={
              "w-full grid grid-cols-1 gap-8 mt-10 text-gray-800 text-normal"
            }
          >
            {categories?.result?.length === 0
              ? null
              : categories.result.map((category) => (
                  <div
                    key={category.category_name + Math.random()}
                    className={"w-full grid grid-cols-1 gap-1 elevation-4 p-3"}
                  >
                    <h2 className={"w-full text-gray-800"}>
                      Treść: {category.category_name}
                    </h2>
                    <div className={"w-full flex flex-row gap-3 text-gray-400"}>
                      <Link href={"/categories/" + category.id}>
                        <p className={"hover:text-red-500 cursor-pointer"}>
                          Edytuj
                        </p>
                      </Link>
                      <p
                        className={"hover:text-red-500 cursor-pointer"}
                        onClick={() => handleDelete(category.id)}
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
export default categories;
