import React from "react";

const ModalMessageContext = React.createContext();

export const ModalMessageProvider = ({ children }) => {
  const [openModalMessage, setOpenModalMessage] = React.useState(() => false);
  const [contentModalMessage, setContentModalMessage] = React.useState(() => {
    return {
      title: "",
      content: "",
    };
  });
  return (
    <ModalMessageContext.Provider
      value={{
        openModalMessage,
        setContentModalMessage,
        setOpenModalMessage,
        contentModalMessage,
      }}
    >
      {children}
    </ModalMessageContext.Provider>
  );
};

export default ModalMessageContext;
