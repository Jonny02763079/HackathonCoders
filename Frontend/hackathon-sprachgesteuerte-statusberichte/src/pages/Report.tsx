import { useState } from "react";
import Button from "../components/Button";
import CreateReport from "../components/CreateReport";

type Props = {
  reportNumber: number;
};

export default function Report({ reportNumber }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Funktion zum Öffnen und Schließen des Popups
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="pt-[80px] w-[100vw] px-[5em]">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-semibold">
          Berichte ( {reportNumber} )
        </div>
        {/* Übergebe togglePopup als onClick */}
        <Button content="Bericht erstellen" onClick={togglePopup} />
      </div>
      <div className="w-full py-[55px] mx-auto bg-white shadow-pageShadow rounded-2xl mt-[40px]">
        <div className="px-[70px]">
          <div className="grid grid-cols-3 font-semibold text-md">
            <div>Berichtstitle</div>
            <div>Ort</div>
          </div>
          <div className="h-[1px] bg-[#F4F4F4] my-5"></div>
          <div className="grid grid-cols-3 font-regular text-md">
            <div>Mock-Report-1</div>
            <div>Dornbirn</div>
            <div className="flex justify-end items-center ">
              <button
                onClick={togglePopup} // Öffnet das Popup
                className="flex justify-between font-semibold text-sm gap-2 items-center hover:bg-[#F4F8FB] rounded-md py-1 px-3"
              >
                <div>Details anzeigen</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="#121212"
                  viewBox="0 0 256 256"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="h-[1px] bg-[#F4F4F4] mt-5"></div>
        </div>
      </div>

      {/* Wenn das Popup geöffnet ist, wird es angezeigt */}
      {isPopupOpen && <CreateReport closePopup={togglePopup} />}

      {/* Hintergrund wird abgedunkelt, wenn das Popup angezeigt wird */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black opacity-80 z-10"></div>
      )}
    </div>
  );
}