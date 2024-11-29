type Props = {
  content: string;
  title: string;
};
export default function Select({ content, title }: Props) {
  return (
    <div>
      <div className="font-semibold text-md mb-2">{title}</div>
      <button>
        <div className="w-[230px] flex justify-between gap-10 items-center border-[1px] border-[#A6A6A6] rounded-md px-4 py-[8px]">
          <div>{content}</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="gray.700"
              viewBox="0 0 256 256"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}
