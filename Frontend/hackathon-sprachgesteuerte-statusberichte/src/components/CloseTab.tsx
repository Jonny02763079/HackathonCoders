import close from "../assets/close.svg";
type Props = {
  closePopup: () => void;
};
export default function CloseTab({ closePopup }: Props) {
  return (
    <div className="p-2 hover:bg-gray-200 flex items-center justify-center rounded-[10px]">
      <button onClick={closePopup}>
        <img src={close} alt="Close" className="w-3 h-3" />
      </button>
    </div>
  );
}
