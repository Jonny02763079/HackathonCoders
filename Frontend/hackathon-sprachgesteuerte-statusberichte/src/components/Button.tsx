type Props = {
  onClick?: () => void; // Optionaler Klick-Handler
  content: string; // Button-Text
};

export default function Button({ onClick, content }: Props) {
  return (
    <button
      onClick={onClick} // onClick an das button-Tag weitergeben
      className="inline-block bg-[#3777AD] rounded-[15px] hover:bg-[#1f4d7a] text-md text-white font-semibold py-[10px] px-[22px] cursor-pointer"
      aria-label={content} // aria-label für barrierefreie Anwendungen
    >
      {content}
    </button>
  );
}
