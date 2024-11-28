type Props = {
  content: string;
};

export default function CreateReport({ content }: Props) {
  return (
    <div className="w-[720px] h-[500px] border-2 border-black rounded-3xl">
      <div className="container">
        <div className="header"></div>
        <div className="content">
          <textarea readOnly>{content}</textarea>
        </div>
      </div>
    </div>
  );
}
