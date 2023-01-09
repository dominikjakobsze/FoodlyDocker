import { AiFillMail } from "react-icons/ai";
import { AiFillFire } from "react-icons/ai";
import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import ModalMessageContext from "../../context/ModalMessageContext";
import { getCookie, setCookie } from "cookies-next";

const LoginForm = () => {
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const router = useRouter();
  React.useEffect(() => {
    if (
      router.query.action == null ||
      (router.query.action != "get-code" && router.query.action != "have-code")
    ) {
      router.push({ query: { action: "get-code" } });
    }
  }, []);
  const action = useRouter().query.action;
  const [word, setWord] = React.useState("");
  const handleSubmit = () => {
    const bodyformdata = new FormData();
    if (action === "get-code") {
      bodyformdata.append("email", word);
      axios
        .post("http://localhost:9600/userauth/email", bodyformdata, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.accepted === true) {
            setContentModalMessage({
              title: "Info",
              content:
                "W wersji dev kod jest wyświetlany bezpośrednio => kod: " +
                res.data.result,
            });
            setOpenModalMessage(true);
          } else {
            setContentModalMessage({
              title: "Info",
              content: res.data.result,
            });
            setOpenModalMessage(true);
          }
        });
    } else {
      bodyformdata.append("code", word);
      axios
        .post("http://localhost:9600/userauth/code", bodyformdata, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.accepted == false) {
            setContentModalMessage({
              title: "Info",
              content: "Kod logowania nie jest poprawny",
            });
            setOpenModalMessage(true);
          } else {
            axios.defaults.headers.common["authtoken"] = getCookie("authtoken");
            console.log(getCookie("authtoken"));
            router.push("/valid/" + res.headers.authtoken);
          }
        });
    }
  };
  return (
    <>
      <div
        className={
          "w-full place-self-center place-items-center grid grid-cols-2 gap-5 font-bold text-slate-400"
        }
      >
        <p
          className={`cursor-pointer p-3 place-self-end ${
            action === "get-code" ? `text-gray-700` : `hover:text-gray-700`
          }`}
          onClick={() => {
            router.push({ query: { action: "get-code" } });
          }}
        >
          Wyślij mi kod
        </p>
        <p
          className={`cursor-pointer p-3 place-self-start ${
            action === "have-code" ? `text-gray-700` : `hover:text-gray-700`
          }`}
          onClick={() => {
            router.push({ query: { action: "have-code" } });
            //preserving the query params router.push({ query: { ...router.query, action: "get-code" } });
          }}
        >
          Mam kod
        </p>
      </div>
      {action === "get-code" && (
        <div
          className={
            "rounded-lg w-full grid grid-cols-8 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px] place-self-center"
          }
        >
          <AiFillMail className={"w-6 h-6"} />
          <input
            type={"text"}
            placeholder={"Email"}
            className={"w-full bg-transparent p-2 col-span-7"}
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>
      )}
      {action === "have-code" && (
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-8 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <AiFillFire className={"w-6 h-6"} />
          <input
            type={"text"}
            placeholder={"Kod"}
            className={"w-full bg-transparent p-2 col-span-7"}
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>
      )}
      <button
        className={
          "hover:bg-red-500 bg-red-400 place-self-center py-3 px-12 rounded-lg text-gray-50 font-bold elevation-3"
        }
        onClick={() => handleSubmit()}
      >
        {action === "get-code" ? `Wyślij kod` : `Sprawdź kod`}
      </button>
    </>
  );
};
export default LoginForm;
