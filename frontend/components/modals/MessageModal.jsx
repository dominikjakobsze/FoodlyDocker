import React from "react";
import ModalMessageContext from "../../context/ModalMessageContext";
import { GoPrimitiveDot } from "react-icons/go";
import DOMPurify from "dompurify";
import { AnimatePresence, motion } from "framer-motion";
const MessageModal = () => {
  const { contentModalMessage, openModalMessage, setOpenModalMessage } =
    React.useContext(ModalMessageContext);
  const [sanitizedContent, setSanitizedContent] = React.useState(() => "");
  React.useEffect(() => {
    setSanitizedContent((prev) => "");
    setSanitizedContent((prev) => {
      return DOMPurify.sanitize(contentModalMessage.content);
    });
  }, [contentModalMessage]);
  return (
    <>
      <AnimatePresence mode={"wait"}>
        {openModalMessage && (
          <motion.div
            transition={{ type: "spring", duration: 0.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={"modal-message"}
            className={
              "w-full h-full fixed top-0 right-0 z-index-100 grid grid-cols-1 place-items-center"
            }
          >
            <div
              className={
                "w-full h-full fixed top-0 right-0 bg-gray-900 opacity-40 z-index-101 grid grid-cols-1 place-items-center"
              }
              onClick={() => setOpenModalMessage((prev) => false)}
            ></div>

            <motion.div
              transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                "z-index-102 w-[90%] max-w-[450px] h-[300px] bg-gray-50 rounded-2xl overflow-hidden flex flex-col gap-3"
              }
            >
              <div
                className={"w-full bg-gray-200 grid grid-cols-5 text-gray-800"}
              >
                <div></div>
                <h1
                  className={
                    "p-1 col-span-3 grid grid-cols-1 place-items-center font-bold"
                  }
                >
                  {contentModalMessage.title}
                </h1>
                <div className={"grid grid-cols-1 p-1 place-items-center"}>
                  <GoPrimitiveDot
                    className={
                      "w-8 h-8 text-gray-700 place-self-end hover:text-gray-800 cursor-pointer"
                    }
                    onClick={() => setOpenModalMessage((prev) => false)}
                  />
                </div>
              </div>
              <div
                className={
                  "w-full p-2 overflow-y-auto grid grid-cols-1 gap-2 text-sm"
                }
                dangerouslySetInnerHTML={{
                  __html: sanitizedContent,
                }}
              ></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default MessageModal;
