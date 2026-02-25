"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, CheckCircle2 } from "lucide-react";

export default function PdfGenerator({ targetId, fileName }) {
    const [generating, setGenerating] = useState(false);
    const [done, setDone] = useState(false);

    const downloadPdf = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        setGenerating(true);
        setDone(false);

        try {
            // Capture the element as a canvas
            const canvas = await html2canvas(element, {
                scale: 3, // High DPI capture as requested
                useCORS: true,
                logging: false,
                backgroundColor: null,
            });

            const imgData = canvas.toDataURL("image/png");

            // Determine orientation based on targetId (Template A vs B)
            const orientation = targetId.includes("premium") ? "landscape" : "portrait";

            const pdf = new jsPDF({
                orientation: orientation,
                unit: "px",
                format: [canvas.width / 3, canvas.height / 3], // Re-scaling back for PDF layout
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
            pdf.save(fileName || "NIN-Slip.pdf");

            setDone(true);
            setTimeout(() => setDone(false), 3000); // Reset status after 3s
        } catch (error) {
            console.error("PDF Generation error:", error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <button
            onClick={downloadPdf}
            disabled={generating}
            className={`
        flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
        ${done
                    ? "bg-emerald-100 text-emerald-700 pointer-events-none"
                    : "bg-[#008751] text-white hover:bg-[#007043] shadow-lg shadow-[#008751]/20 active:scale-95 disabled:opacity-50"
                }
      `}
        >
            {generating ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating PDF...</span>
                </>
            ) : done ? (
                <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Downloaded!</span>
                </>
            ) : (
                <>
                    <Download className="h-5 w-5" />
                    <span>Download Slip</span>
                </>
            )}
        </button>
    );
}
