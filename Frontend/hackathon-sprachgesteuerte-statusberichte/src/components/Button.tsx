type Props = {
  content: string;
};

export default function Button({ content }: Props) {
  return (
    <div className="inline-block bg-[#3777AD] rounded-[15px] hover:cursor-pointer hover:bg-[#1f4d7a] ">
      <div className="text-md text-white px-[22px] font-semibold py-[10px]">
        {content}
      </div>
    </div>
  );
}
