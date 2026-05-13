"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import type { SickLeaveReport } from "@/lib/types";
import ReportTemplate from "@/components/ReportTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<SickLeaveReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/reports/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setReport(null);
        } else {
          setReport(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const generatePDF = useCallback(async () => {
    if (!reportRef.current) return;
    setGenerating(true);

    const pages = reportRef.current.querySelectorAll<HTMLDivElement>(
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

    pdf.save(`sick-leave-report-${report?.leaveId ?? id}.pdf`);
    setGenerating(false);
  }, [report?.leaveId, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#2B3D77] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل التقرير...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">التقرير غير موجود</p>
          <Link href="/create" className="text-[#2B3D77] underline">
            العودة لإنشاء تقرير جديد
          </Link>
        </div>
      </div>
    );
  }

  const inquiryUrl = `${baseUrl}/inquiry?leaveId=${report.leaveId}`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Bar */}
      <div className="bg-[#2B3D77] text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              تقرير إجازة مرضية / Sick Leave Report
            </h1>
            <p className="text-blue-200 text-sm">
              Leave ID: {report.leaveId}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              disabled={generating}
              className="bg-white text-[#2B3D77] font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
            >
              {generating ? "جاري التوليد..." : "تحميل PDF"}
            </button>
            <Link
              href="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              تقرير جديد
            </Link>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow flex flex-wrap gap-4 items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">رابط الاستعلام / Inquiry Link</p>
            <a
              href={inquiryUrl}
              className="text-[#2B3D77] underline text-sm break-all"
            >
              {inquiryUrl}
            </a>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(inquiryUrl)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg transition"
          >
            نسخ الرابط
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div
          ref={reportRef}
          className="shadow-2xl rounded-lg overflow-hidden"
          style={{ background: "#fff" }}
        >
          <ReportTemplate report={report} baseUrl={baseUrl} />
        </div>
      </div>
    </div>
  );
}
