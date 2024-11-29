import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PdfContent from "./PdfContent";

const DownloadPdf = () => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    if (!contentRef.current) {
      console.error("Inhalt nicht gefunden!");
      return;
    }

    try {
      // Canvas-Rendering
      const canvas = await html2canvas(contentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // PDF-Erstellung
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("seite.pdf");
    } catch (error) {
      console.error("Fehler beim Generieren des PDFs:", error);
    }
  };

  return (
    <div>
      <div
        ref={contentRef}
        style={{ padding: "20px", backgroundColor: "white" }}
      >
        <PdfContent />
      </div>

      <button
        onClick={handleDownload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#3777AD",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default DownloadPdf;
