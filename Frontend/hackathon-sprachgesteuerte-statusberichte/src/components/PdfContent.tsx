// PdfContent.tsx
import React from "react";

const PdfContent = () => {
  return (
    <div>
      <div className="flex justify-center font-bold text-3xl">Bericht</div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Erstellt am:</div>
        <div className="">hier kommt der inhalt an von der variable</div>
      </div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Baustelle:</div>
        <div className="">
          hier kommt der inhalt an von der variable der baustelle
        </div>
      </div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Bericht-ID:</div>
        <div className="">hier kommt der inhalt an von der variable</div>
      </div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Was wurde erledigt:</div>
        <div className="">hier kommt der inhalt an von der variable</div>
      </div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Materialien verwendet:</div>
        <div className="">hier kommt der inhalt an von der variable</div>
      </div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Aufgetauchte Probleme:</div>
        <div className="">hier kommt der inhalt an von der variable</div>
      </div>

      <div className="mt-10 flex gap-2 items-center">
        <div className="text-xl font-bold">Sonstige Anmerkungen:</div>
        <div className="">hier kommt der inhalt an von der variable</div>
      </div>
    </div>
  );
};

export default PdfContent;
