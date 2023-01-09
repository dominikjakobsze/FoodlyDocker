const IndexSubHeader = ({ children, align }) => {
  return (
    <>
      <h3
        className={`w-full px-3 pb-1 mb-1 text-sm text-gray-400 text-${align}`}
      >
        {children}
      </h3>
    </>
  );
};
export default IndexSubHeader;
