import { useState, useEffect } from "react";
import Button from "../components/Button";
import CreateReport from "../components/CreateReport";
import ReportRow from "./ReportRow";

type Props = {
  reportNumber: number;
};

const getAllReports = async () => {
  try {
    const res = await fetch(`http://64.226.84.217:8055/items/reports`);
    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Could not load data", error);
    return null;
  }
};

export default function Report({ reportNumber }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [data, setData] = useState<any[] | null>(null);

  // Funktion zum Öffnen und Schließen des Popups
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const fetchReports = async () => {
      const reports = await getAllReports();
      if (reports && reports.data) {
        setData(reports.data);
      } else {
        setData([]);
      }
    };

    fetchReports();
  }, []);

  console.log(data);

  return (
    <div className="pt-[80px] w-[100vw] px-[5em]">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-semibold">
          Berichte ( {data?.length} )
        </div>
        {/* Übergebe togglePopup als onClick */}
        <Button content="Bericht erstellen" onClick={togglePopup} />
      </div>
      <div className="w-full py-[55px] mx-auto bg-white shadow-pageShadow rounded-2xl mt-[40px]">
        <div className="px-[70px]">
          <div className="grid grid-cols-3 font-semibold text-md">
            <div>Berichtstitle</div>
            <div>Ort</div>
          </div>
          <div className="h-[1px] bg-[#F4F4F4] my-5"></div>
          <div>
            {data ? (
              data.map((report) => (
                <div>
                  <ReportRow
                    key={report.id}
                    id={report.id}
                    title={report.title}
                    construction_site={report.construction_site}
                  />
                  <div className="h-[1px] bg-[#F4F4F4] mb-5 my-5"></div>
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>

      {/* Wenn das Popup geöffnet ist, wird es angezeigt */}
      {isPopupOpen && <CreateReport closePopup={togglePopup} />}

      {/* Hintergrund wird abgedunkelt, wenn das Popup angezeigt wird */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black opacity-80 z-10"></div>
      )}
    </div>
  );
}
