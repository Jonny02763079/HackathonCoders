import Button from "../components/Button";
type Props = {
  reportNumber: number;
};

export default function Report({ reportNumber }: Props) {
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
            <div className="flex justify-end items-center ">
              <button className="flex justify-between gap-2 items-center hover:bg-[#F4F8FB] rounded-2xl px-3">
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
          <div className="h-[1px] bg-[#9B9B9B] my-5"></div>
        </div>
      </div>
    </div>
  );
}
