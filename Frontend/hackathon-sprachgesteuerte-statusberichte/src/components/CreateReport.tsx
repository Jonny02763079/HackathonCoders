import AudioWaveRecorder from "./AudioWaveRecorder";
import CloseTab from "./CloseTab";
import Button from "./Button";
import Select from "./Select";
import { useEffect, useState } from "react";

export default function CreateReport({ closePopup }: any) {
  const spokenLanguage = "de";
  const translateInLanguage = "de";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("DE");

  const [title, setTitle] = useState<string>("");
  const [standOrt, setStandOrt] = useState<string>("");
  const [speechContent, setSpeechContent] = useState<string>("");

  const [translatedText, setTranslatedText] = useState<string>("");

  // Fehlerzustände für die Validierung
  const [titleError, setTitleError] = useState<string>("");
  const [standOrtError, setStandOrtError] = useState<string>("");

  useEffect(() => {
    setSpeechContent(translatedText);
  }, [translatedText]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleError(""); // Fehler zurücksetzen
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStandOrt(e.target.value);
    setStandOrtError(""); // Fehler zurücksetzen
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  const validateInputs = (): boolean => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Berichtstitel darf nicht leer sein.");
      isValid = false;
    }

    if (!standOrt.trim()) {
      setStandOrtError("Standort darf nicht leer sein.");
      isValid = false;
    }

    return isValid;
  };

  const saveReport = () => {
    // Validierung durchführen
    if (!validateInputs()) {
      return;
    }

    console.log("Berichtstitel:", title);
    console.log("Standort:", standOrt);

    sendToReport();
    closePopup();
  };

  async function sendToReport() {
    console.log("inside");

    try {
      const response = await fetch(`http://localhost:3000/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          constructionSite: standOrt,
          inputText: speechContent,
          title: title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Report successfully created:", data);
    } catch (error) {
      console.error("Error during fetch request:", error);
    }
  }

  return (
    <div className="w-8/12 py-12 px-12 bg-white mx-auto rounded-xl absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] z-20">
      <div className="flex justify-between items-center mb-12">
        <div className="font-bold text-2xl">Bericht erstellen</div>
        <CloseTab closePopup={closePopup} />
      </div>

      <div className="flex justify-between mb-12">
        <div>
          <div className="font-semibold text-md mb-2">Berichtstitel</div>
          <input
            value={title}
            onChange={handleTitleChange}
            className={`w-[230px] flex justify-between gap-10 items-center border-[1px] ${titleError ? "border-red-500" : "border-[#A6A6A6]"
              } rounded-md px-4 py-[8px] focus:outline-none`}
            required
          />
          {titleError && (
            <div className="text-red-500 text-sm mt-1">{titleError}</div>
          )}
        </div>

        <div>
          <div className="font-semibold text-md mb-2">Standort</div>
          <input
            value={standOrt}
            onChange={handleLocationChange}
            className={`w-[230px] flex justify-between gap-10 items-center border-[1px] ${standOrtError ? "border-red-500" : "border-[#A6A6A6]"
              } rounded-md px-4 py-[8px] focus:outline-none`}
            required
          />
          {standOrtError && (
            <div className="text-red-500 text-sm mt-1">{standOrtError}</div>
          )}
        </div>

        <Select content="Projekt" title="Projekt" />
      </div>

      <div className="bg-white flex justify-between items-center">
        <AudioWaveRecorder
          spokenLanguage={spokenLanguage}
          translateInLanguage={translateInLanguage}
          translatedText={translatedText}
          setTranslatedText={setTranslatedText}
        />

        <div>
          <button
            onClick={toggleDropdown}
            className="hover:bg-[#265f7d] bg-[#3777AD] w-[70px] h-[35px] rounded-[10px] flex justify-center items-center text-white font-bold text-sm"
          >
            {selectedLanguage}
          </button>
          {isDropdownOpen && (
            <div className="absolute w-[70px] mt-2 border-[1px] border-[#A6A6A6] rounded-md bg-white shadow-lg">
              <ul className="cursor-pointer mx-auto">
                <li
                  className="p-2 hover:bg-[#CDE7F8] flex justify-center"
                  onClick={() => selectLanguage("EN")}
                >
                  EN
                </li>
                <li
                  className={`p-2 hover:bg-[#CDE7F8] flex justify-center ${"DE" === selectedLanguage ? "font-bold bg-[#CDE7F8]" : ""
                    }`}
                  onClick={() => selectLanguage("DE")}
                >
                  DE
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="w-full my-10 h-auto min-h-[100px] max-h-[250px] p-5 border-[2px] border-gray-200 bg-white rounded-md overflow-y-auto scroll-to-bottom">
        {translatedText || "Waiting..."}
      </div>

      <div className="flex justify-end">
        <Button content="speichern" onClick={saveReport} />
      </div>
    </div>
  );
}
