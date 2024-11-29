import { Link } from "react-router-dom";

type Props = {
  content: string;
  activeLink: "berichte" | "baustellen" | null;
  path: string;
  onClick: () => void;
};

export default function NavBarItem({
  content,
  activeLink,
  path,
  onClick,
}: Props) {
  const isActive = activeLink === content.toLowerCase();

  return (
    <div className="flex gap-x-2 items-center">
      <div
        className={`w-[6px] h-[6px] bg-[#3777AD] rounded-full ${
          isActive ? "visible" : "invisible"
        }`}
      ></div>
      <div>
        <Link className="font-semibold text-md" to={path} onClick={onClick}>
          {content}
        </Link>
      </div>
    </div>
  );
}
