import React, { useEffect, useState } from "react";

export default function ConstructionSite() {
  const [constructionSites, setConstructionSites] = useState([]); // State für die Baustellen
  const [loading, setLoading] = useState(true); // Ladezustand
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

  return (
    <div className="pt-[80px] w-[100vw] px-[5em]">
      <div className="text-3xl font-semibold">
        Baustellen ( {constructionSites.length} )
      </div>

      <div className="w-full py-[55px] mx-auto bg-white shadow-pageShadow rounded-2xl mt-[40px]">
        <div className="px-[70px]">
          {/*Überschriften*/}
          <div className="grid grid-cols-3 font-semibold text-md">
            <div>Baustelle</div>
            <div>Firma</div>
            <div>Ort</div>
          </div>

          {/*Strich*/}
          <div className="h-[1px] bg-[#F4F4F4] my-5"></div>

          {constructionSites.map((site, index) => (
            <div key={index}>
              <div className="grid grid-cols-3 font-regular text-md">
                <div>{site.name || "Beschreibung nicht verfügbar"}</div>
                <div>{site.company || "Firma nicht verfügbar"}</div>
                <div>{site.address || "Ort nicht verfügbar"}</div>
              </div>

              {/* Strich nach jedem Eintrag */}
              <div className="h-[1px] bg-[#F4F4F4] my-5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
