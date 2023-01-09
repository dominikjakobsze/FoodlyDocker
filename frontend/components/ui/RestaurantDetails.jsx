/**
 *
 * @param restaurant
 * @param restaurant.imageurl
 * @param restaurant.openclose
 * @param restaurant.email
 * @param restaurant.name
 * @param restaurant.user_image
 * @returns {JSX.Element}
 * @constructor
 */
const RestaurantDetails = ({ restaurant }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-3 gap-3">
        <img
          src={"http://localhost:9600" + restaurant.imageurl}
          alt={restaurant.name}
          className={"w-full h-[500px] object-contain"}
        />
        <h1 className={"w-full text-gray-400 text-center"}>
          {restaurant.openclose}
        </h1>
        <div
          className={
            "w-full flex flex-row flex-wrap flex-[0_1_auto] text-xl font-bold tracking-widest text-gray-800 items-center gap-5 justify-center"
          }
        >
          <h1 className={"cursor-pointer"}>{restaurant.email}</h1>
          <img
            src={"http://localhost:9600" + restaurant.user_image}
            alt="avatar"
            className={"w-10 h-10 object-cover rounded-full"}
          />
        </div>
      </div>
    </>
  );
};

export default RestaurantDetails;
