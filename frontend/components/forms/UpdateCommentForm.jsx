import React from "react";
import axios from "axios";
import ModalMessageContext from "../../context/ModalMessageContext";
import { getCookie } from "cookies-next";
const UpdateCommentForm = ({ commentId, commentContent }) => {
  const [content, setContent] = React.useState(commentContent);
  const { setContentModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const handleSubmit = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("content", content);
    axios
      .post("http://localhost:9600/comment/" + commentId, bodyFormData, {
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
            content: "Zmieniono Treść Komentarza",
          }));
          setOpenModalMessage(true);
        }
      });
  };
  return (
    <>
      <div className={"w-full p-3 flex-col flex-wrap flex gap-4 mt-10 mb-5"}>
        <div
          className={
            "rounded-lg w-full place-self-center grid grid-cols-1 place-items-center bg-transparent elevation-3 text-gray-700 max-w-[430px]"
          }
        >
          <textarea
            value={content}
            className={"w-full bg-transparent p-2"}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          className={
            "hover:bg-red-500 bg-red-400 place-self-center py-2 px-8 rounded-lg text-gray-50 font-bold elevation-3"
          }
          onClick={() => handleSubmit()}
        >
          Zmień treść
        </button>
      </div>
    </>
  );
};
export default UpdateCommentForm;
