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

      // Capture logic
      const canvas = await html2canvas(element, {
        scale: 4, // Ultra-high resolution
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
           // Crucial: Finding the element in the cloned document
           // and removing any scaling/transforms that might be inherited from the preview UI
           const clonedElement = clonedDoc.body.querySelector(`[class*="premium-card-container"]`) || 
                               clonedDoc.body.querySelector(`[ref="${templateRef?.current?.getAttribute?.('ref')}"]`) ||
                               clonedDoc.body.querySelector('.premium-card-container');

           // If we're capturing a scaled preview, we need to reset the transform on the clone
           // so html2canvas sees the natural size.
           const previewContainers = clonedDoc.querySelectorAll('.scale-\\[0\\.55\\], .scale-\\[0\\.75\\], .scale-\\[0\\.95\\]');
           previewContainers.forEach(container => {
              container.style.transform = 'none';
              container.style.scale = '1';
           });

           // Force visible on the clone for capture
           if (clonedElement) {
              clonedElement.style.transform = 'none';
              clonedElement.style.opacity = '1';
              clonedElement.style.visibility = 'visible';
           }
        }
      });

      const imgData = canvas.toDataURL("image/png");

      let pdf;
      let filename;

      if (slipType === "premium" || slipType === "plastic") {
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

      // Centering logic
      const yPos = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, "PNG", 0, Math.max(0, yPos), imgWidth, imgHeight);

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
        className="px-8 py-4 rounded-2xl font-black text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,135,81,0.2)] hover:shadow-[0_15px_30px_rgba(0,135,81,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background: isLoading
            ? "#94a3b8"
            : "linear-gradient(135deg, #008751, #007043)",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
            <span>Processing Identity...</span>
          </>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span className="uppercase tracking-widest text-sm">Download High-Res PDF</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-2 font-bold px-4 py-2 bg-red-50 rounded-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
