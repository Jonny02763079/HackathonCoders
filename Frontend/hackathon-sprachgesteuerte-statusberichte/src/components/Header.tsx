import NavBarItem from "./NavBarItem";
import { useState } from "react";
import German from '../assets/pictures/GermanFlagg.jpeg';
import England from '../assets/pictures/EnglandFlagge.jpeg';
import LogoRhomberg from '../assets/pictures/Logo_Rhomberg_SERSA-removebg-preview.png';

export default function Header() {
  const [activeLink, setActiveLink] = useState<
    "berichte" | "baustellen" | null
  >("berichte");
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("DE");

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  // Überprüft, welche Sprache aktuell ausgewählt ist und gibt eine Nachricht zurück
  const getSelectedLanguageMessage = () => {
    switch (selectedLanguage) {
      case "DE":
        return "Deutsch (DE)";
      case "EN":
        return "English (EN)";
      default:
        return "Keine Sprache ausgewählt";
    }
  };

  return (
    <div className="grid grid-cols-3 h-[80px] items-center px-12 shadow-custom">
      <div className="flex items-center gap-x-8">
        <div >
          {selectedLanguage === "DE" ? (
            <img className="w-[45px] h-[45px] rounded-full" src={German} alt="" />
          ) : (
            <img className="w-[45px] h-[45px] rounded-full" src={England} alt="" />
          )}
        </div>

        <div>
          <button onClick={toggleDropdown}>
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{selectedLanguage}</div>

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
            </div>
          </button>

          {isDropDownOpen && (
            <div className="absolute mt-2 w-[230px] border-[1px] border-[#BDBDBD] rounded-md bg-white shadow-lg">
              <ul className="items-center justify-center rounded-md my-2">
                <li
                  className={`mx-2 rounded-md p-2 cursor-pointer px-4 py-[8px] ${"DE" === selectedLanguage ? "font-bold bg-[#CDE7F8]" : ""
                    }`}
                  onClick={() => selectLanguage("DE")}
                >
                  DE
                </li>
                <li
                  className={`mx-2 rounded-md p-2 cursor-pointer px-4 py-[8px] ${"EN" === selectedLanguage ? "font-bold bg-[#CDE7F8]" : ""
                    }`}
                  onClick={() => selectLanguage("EN")}
                >
                  EN
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-20 justify-center">
        <NavBarItem
          content="Berichte"
          path="/report"
          activeLink={activeLink}
          onClick={() => setActiveLink("berichte")}
        />
        <NavBarItem
          content="Baustellen"
          path="/construction"
          activeLink={activeLink}
          onClick={() => setActiveLink("baustellen")}
        />
      </div>
      <div className="flex justify-end">
        <button className="cursor-pointer">
          <a href="https://www.rhomberg-sersa.com/de">
            <img className="w-[150px]" src={LogoRhomberg} alt="" />
          </a>
        </button>
      </div>
    </div>
  );
}
