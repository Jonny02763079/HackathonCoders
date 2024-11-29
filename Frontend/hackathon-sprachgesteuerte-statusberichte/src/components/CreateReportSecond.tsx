import AudioWaveRecorder from "./AudioWaveRecorder";
import CloseTab from "./CloseTab";
import Button from "./Button";

type Props = {
  closePopup: () => void;
  content?: string;
};

export default function CreateReportSecond({ content, closePopup }: Props) {
  return (
    <div className="w-6/12 py-16 px-12 bg-white mx-auto rounded-xl absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-20">
      <CloseTab closePopup={closePopup} />

      <div className="bg-white flex justify-between items-center">
        <AudioWaveRecorder />
        <button className="hover:bg-[#265f7d] bg-[#3777AD] w-[70px] h-[35px] rounded-[10px] flex justify-center items-center text-white font-bold text-sm">
          DE
        </button>
      </div>

      <div className="w-full my-10 h-auto min-h-[100px] max-h-[250px] p-5 border-[1px] border-gray-200 bg-white rounded-md overflow-y-auto scroll-to-bottom">
        {content || "Waiting..."}
      </div>

      <div className="flex justify-end">
        <Button content="weiter" />
      </div>
    </div>
  );
}
