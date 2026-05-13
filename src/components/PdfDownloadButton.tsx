"use client";

import { useState, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  leaveId: string;
  reportId: string;
}

export default function PdfDownloadButton({ leaveId, reportId }: Props) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = useCallback(async () => {
    const container = document.getElementById("report-container");
    if (!container) return;
    setGenerating(true);

    const pages = container.querySelectorAll<HTMLDivElement>(
      "#report-content > div"
    );

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 842,
        height: 1191,
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    // Add clickable link to inquiry page on the last page
    const lastPageNum = pdf.getNumberOfPages();
    pdf.setPage(lastPageNum);
    pdf.link(15, 250, 60, 15, { url: `${window.location.origin}/inquiry?leaveId=${leaveId}` });

    pdf.save(`sick-leave-report-${leaveId || reportId}.pdf`);
    setGenerating(false);
  }, [leaveId, reportId]);

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="bg-white text-[#2B3D77] font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
    >
      {generating ? "جاري التوليد..." : "تحميل PDF"}
    </button>
  );
}
