import { useEffect, useState } from "react";

type Props = {
  content: string;
  title: string;
};
export default function Select({ content, title }: Props) {
  const [constructionSites, setConstructionSites] = useState([]); // State für die Baustellen
  const [loading, setLoading] = useState(true); // Ladezustand
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Zustand des Dropdowns
  const [selectedSite, setSelectedSite] = useState(content); // Für die Auswahl des Projekts
  console.log("constructionSites", constructionSites);
  // Funktion zum Abrufen der Daten
  const getConstructionSites = async () => {
    try {
      const res = await fetch(
        `http://64.226.84.217:8055/items/construction_sites`
      );
      if (!res.ok) {
        console.error(`Error: ${res.status} ${res.statusText}`);
        return null;
      }

      const json = await res.json(); // JSON-Daten parsen
      console.log("Fetched JSON Data:", json); // JSON in der Konsole ausgeben
      setConstructionSites(json.data || []); // Daten im State speichern
    } catch (error) {
      console.error("Could not load data", error);
    } finally {
      setLoading(false); // Ladezustand beenden
    }
  };

  // Daten laden, wenn die Komponente gemountet wird
  useEffect(() => {
    getConstructionSites();
  }, []);

  // Anzeige des Lade-, Fehler- oder Erfolgszustands
  if (loading) return <div>Lade Daten...</div>;

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Funktion zum Auswählen eines Projekts aus dem Dropdown
  const selectSite = (siteName: string) => {
    setSelectedSite(siteName);
    setIsDropdownOpen(false); // Dropdown schließen nach Auswahl
  };

  return (
    <div>
      <div className="font-semibold text-md mb-2">{title}</div>
      <button onClick={toggleDropdown}>
        <div className="w-[230px] flex justify-between gap-10 items-center border-[1px] border-[#A6A6A6] rounded-md px-4 py-[8px]">
          <div>{selectedSite}</div>
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

      {/* Dropdown Anzeige */}
      {isDropdownOpen && (
        <div className="absolute mt-2 w-[230px] border-[1px] border-[#A6A6A6] rounded-md bg-white shadow-lg">
          <ul>
            {constructionSites.map((site, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer px-4 py-[8px] ${
                  site.name === selectedSite ? "font-bold bg-[#CDE7F8]" : ""
                }`}
                onClick={() => selectSite(site.name)} // Auswählen eines Projekts
              >
                {site.name} {/* Hier den Projektnamen oder Titel anzeigen */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
