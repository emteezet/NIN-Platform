"use client";

import { useState } from "react";

export default function DownloadButton({
  templateRef,
  fileName = "NIN-Slip",
  slipType = "full",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!templateRef?.current) {
      setError("Template not found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      const element = templateRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      let pdf;
      let filename;

      if (slipType === "premium") {
        // ID-1 size: 85.6mm x 53.98mm
        pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [85.6, 53.98],
        });
        filename = `${fileName}-Premium.pdf`;
      } else {
        // A4 vertical
        pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        filename = `${fileName}-Full.pdf`;
      }

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: isLoading
            ? "rgba(13, 107, 13, 0.5)"
            : "linear-gradient(135deg, #0d6b0d, #1a8c1a)",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? (
          <>
            <span
              className="spinner"
              style={{
                width: "16px",
                height: "16px",
                borderWidth: "2px",
                borderTopColor: "white",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            />
            Generating PDF...
          </>
        ) : (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
