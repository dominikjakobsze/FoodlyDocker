import React from "react";

const RestaurantComments = ({ comments }) => {
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-5 mt-8 p-3">
        {comments.map(({ email, imageurl, content }) => (
          <div
            key={email + content + Math.random()}
            className={
              "w-full flex flex-row items-center justify-start gap-2 elevation-4 p-3 flex-wrap"
            }
          >
            <img
              src={"http://localhost:9600" + imageurl}
              alt={email + imageurl}
              className={"w-10 h-10 object-cover rounded-full"}
            />
            <h1
              className={`flex-[0_0_27%] text-normal text-gray-800 font-bold`}
            >
              {email}
            </h1>
            <h3 className={`flex-[0_0_45%] text-sm text-gray-400`}>
              {content}
            </h3>
          </div>
        ))}
      </div>
    </>
  );
};
export default RestaurantComments;
