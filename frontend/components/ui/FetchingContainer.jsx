const FetchingContainer = ({ children }) => {
  return (
    <>
      <div
        className={"w-full h-full flex flex-col items-center justify-center"}
      >
        {children}
      </div>
    </>
  );
};
export default FetchingContainer;
