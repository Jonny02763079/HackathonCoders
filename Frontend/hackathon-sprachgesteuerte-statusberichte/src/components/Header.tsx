import NavBarItem from "./NavBarItem";
import { useState } from "react";

export default function Header() {
  const [activeLink, setActiveLink] = useState<"bericht" | "baustelle" | null>(
    "bericht"
  );
  return (
    <div className="grid grid-cols-3 h-[80px] items-center px-12 shadow-custom">
      <div className="flex items-center gap-x-8">
        <div className="w-[45px] h-[45px] bg-[#3777AD] rounded-full"></div>
        <div className="flex items-center justify-between gap-2">
          <div>DE</div>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="gray.700"
              viewBox="0 0 256 256"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex gap-20 justify-center">
        <NavBarItem
          content="Bericht"
          path="/report"
          activeLink={activeLink}
          onClick={() => setActiveLink("bericht")}
        />
        <NavBarItem
          content="Baustelle"
          path="/construction"
          activeLink={activeLink}
          onClick={() => setActiveLink("baustelle")}
        />
      </div>
      <div></div>
    </div>
  );
}
