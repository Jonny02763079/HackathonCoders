import Button from "../components/Button";
import VoiceRecorder from "../components/VoiceRecorder";
type Props = {
  reportNumber: number;
};

export default function Report({ reportNumber }: Props) {
  const translateInLanguage = "de"
  const spokenLanguage = "de"

  return (
    <div className="pt-[80px] w-[100vw] px-[5em]">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-semibold">
          Berichte ( {reportNumber} )
        </div>
        <Button content="Bericht erstellen" />
      </div>
      <div className="w-full py-[40px] mx-auto bg-white shadow-pageShadow rounded-3xl mt-[40px]">
        <div className="px-[70px]">
          <div className="grid grid-cols-3 font-medium">
            <div>Berichtstitle</div>
            <div>Ort</div>
          </div>
          <div className="h-[1px] bg-[#9B9B9B] my-5"></div>
          <div className="grid grid-cols-3">
            <div>Mock-Report-1</div>
            <div>Dornbirn</div>
            <button>
              <div className="flex justify-end">Details anzeigen</div>
            </button>
          </div>
          <div className="h-[1px] bg-[#9B9B9B] my-5"></div>
        </div>
      </div>

      <VoiceRecorder spokenLanguage={spokenLanguage} translateInLanguage={translateInLanguage} />

    </div>
  );
}
