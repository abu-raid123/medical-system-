import { getReportById } from "@/lib/storage";
import { headers } from "next/headers";
import Link from "next/link";
import QRCode from "qrcode";
import ReportTemplate from "@/components/ReportTemplate";
import PdfDownloadButton from "@/components/PdfDownloadButton";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = getReportById(id);

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

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;
  const inquiryUrl = `${baseUrl}/inquiry?leaveId=${report.leaveId}`;

  const qrDataUrl = await QRCode.toDataURL(inquiryUrl, {
    width: 180,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });

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
            <PdfDownloadButton leaveId={report.leaveId} reportId={id} />
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
        </div>
      </div>

      {/* Report Preview */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div
          id="report-container"
          className="shadow-2xl rounded-lg overflow-hidden"
          style={{ background: "#fff" }}
        >
          <ReportTemplate report={report} baseUrl={baseUrl} qrDataUrl={qrDataUrl} />
        </div>
      </div>
    </div>
  );
}
