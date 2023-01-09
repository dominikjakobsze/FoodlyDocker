import React from "react";
import ActionMessageContext from "../../context/ActionMessageContext";
import { motion, AnimatePresence } from "framer-motion";
const ActionMessage = () => {
  const { isOpen, setIsOpen, content } = React.useContext(ActionMessageContext);
  return (
    <>
      <AnimatePresence mode={"wait"}>
        {isOpen && (
          <motion.div
            key={"action-message"}
            initial={{ x: -2000 }}
            animate={{ x: 0 }}
            exit={{ x: -2000 }}
            transition={{ type: "spring", duration: 0.8 }}
            className={
              "w-full bg-red-500 p-3 fixed top-0 right-0 z-40 text-gray-50 text-sm text-center font-bold"
            }
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ActionMessage;
