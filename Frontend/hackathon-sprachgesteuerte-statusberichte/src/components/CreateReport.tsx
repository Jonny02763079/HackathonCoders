import AudioWaveRecorder from "./AudioWaveRecorder";
import CloseTab from "./CloseTab";
import Button from "./Button";
import Select from "./Select";
import { useState } from "react";

type Props = {
  closePopup: () => void;
  content?: string;
};

export default function CreateReport({ content, closePopup }: Props) {
  const [title, setTitle] = useState("");
  const [standOrt, setStandOrt] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStandOrt(e.target.value);
  };

  const saveReport = () => {
    console.log("Berichtstitel:", title);
    console.log("Standort:", location);
    alert("Bericht gespeichert!");
  };

  return (
    <div className="w-8/12 py-12 px-12 bg-white mx-auto rounded-xl absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-20">
      <div className="flex justify-between items-center mb-12">
        <div className="font-bold text-2xl">Bericht erstellen</div>
        <CloseTab closePopup={closePopup} />
      </div>

      <div className="flex justify-between mb-12">
        <div>
          <div className="font-semibold text-md mb-2">Berichtstitel</div>
          <input
            value={title}
            onChange={handleTitleChange}
            className="w-[230px] flex justify-between gap-10 items-center border-[1px] border-[#A6A6A6] rounded-md px-4 py-[8px] focus:outline-none"
          ></input>
        </div>

        <div>
          <div className="font-semibold text-md mb-2">Standort</div>
          <input
            value={standOrt}
            onChange={handleLocationChange}
            className="w-[230px] flex justify-between gap-10 items-center border-[1px] border-[#A6A6A6] rounded-md px-4 py-[8px] focus:outline-none"
          ></input>
        </div>

        <Select content="Projekt" title="Projekt" />
      </div>

      <div className="bg-white flex justify-between items-center">
        <AudioWaveRecorder />
        <button className="hover:bg-[#265f7d] bg-[#3777AD] w-[70px] h-[35px] rounded-[10px] flex justify-center items-center text-white font-bold text-sm">
          DE
        </button>
      </div>

      <div className="w-full my-10 h-auto min-h-[100px] max-h-[250px] p-5 border-[2px] border-gray-200 bg-white rounded-md overflow-y-auto scroll-to-bottom">
        {content || "Waiting..."}
      </div>

      <div className="flex justify-end">
        <Button content="speichern" onClick={saveReport} />
      </div>
    </div>
  );
}
