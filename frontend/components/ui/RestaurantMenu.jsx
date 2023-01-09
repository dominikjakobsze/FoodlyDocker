import React from "react";

const RestaurantMenu = ({ menus }) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 gap-5 mt-5">
      {menus.map(({ about, id, imageurl, name, price }) => (
        <div
          className={"flex flex-col items-center justify-center gap-2"}
          key={id + about}
        >
          <img
            src={"http://localhost:9600" + imageurl}
            alt={name + about}
            className={"w-full max-h-[300px] object-contain"}
          />
          <h1 className={`w-full text-xl text-gray-800 font-bold text-center`}>
            {name} {price} zł
          </h1>
          <h3 className={`w-[70%] text-sm text-gray-400`}>{about}</h3>
        </div>
      ))}
    </div>
  );
};
export default RestaurantMenu;
