import React from "react";
const ActionMessageContext = React.createContext();
export const ActionMessageProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState("");
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(() => false);
      }, 3000);
    }
  }, [isOpen]);
  return (
    <>
      <ActionMessageContext.Provider
        value={{ isOpen, setIsOpen, content, setContent }}
      >
        {children}
      </ActionMessageContext.Provider>
    </>
  );
};
export default ActionMessageContext;
