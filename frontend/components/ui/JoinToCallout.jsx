import JoinToImage from "../../public/img/jointo.jpg";
import { AiOutlineCheck } from "react-icons/ai";
const JoinToCallout = () => {
  return (
    <>
      <img
        className={"mt-5 w-full h-[400px] object-cover"}
        src={JoinToImage.src}
        alt={"Join To Image - Restaurant"}
      />
      <div
        className={
          "mt-4 w-full p-3 grid grid-cols-1 place-items-center text-gray-800 gap-10"
        }
      >
        <div className={"w-[85%] sm:w-1/2 flex flex-wrap flex-row gap-2"}>
          <AiOutlineCheck className={"w-6 h-6"} />
          <h3 className={"text-normal"}>Wypełnij zgłoszenie</h3>
          <p className={"flex-[0_0_100%] text-sm text-gray-400"}>
            Na tym etapie podaj nam podstawowe informacje takie jak: adres,
            godziny otwarcia, rodzaj kuchni, itp. Następnie dodaj główne
            zdjęcie, opisz swoją restaurację i dodaj menu. Wybierz też kategorię
            lokalu jak np. restauracja, bar, pub, itp.
          </p>
        </div>
        <div className={"w-[85%] sm:w-1/2 flex flex-wrap flex-row gap-2"}>
          <AiOutlineCheck className={"w-6 h-6"} />
          <h3 className={"text-normal"}>Poczekaj na weryfikację</h3>
          <p className={"flex-[0_0_100%] text-sm text-gray-400"}>
            Po wypełnieniu zgłoszenia nasz zespół zweryfikuje dane, istnieje
            możliwość, że skontaktujemy się z Tobą w celu uzyskania dodatkowych
            informacji lub potwierdzeń np. jeśli zaznaczyłeś 'restauracja
            premium'
          </p>
        </div>
        <div className={"w-[85%] sm:w-1/2 flex flex-wrap flex-row gap-2"}>
          <AiOutlineCheck className={"w-6 h-6"} />
          <h3 className={"text-normal"}>Witamy na pokładzie!</h3>
          <p className={"flex-[0_0_100%] text-sm text-gray-400 mb-5"}>
            To ten moment w którym Twoje konto zmieni status na restaurator!
            Otrzymujesz pełną kontrolę nad tym jak Twój lokal prezentuje się w
            Foodly, możesz dodać menu, zdjęcia, opisy. Możesz również
            poinformować klientów o aktualnych promocjach/wydarzeniach.
          </p>
        </div>
      </div>
    </>
  );
};
export default JoinToCallout;
