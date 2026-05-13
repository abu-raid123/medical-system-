import { getReportByLeaveId } from "@/lib/storage";
import type { SickLeaveReport } from "@/lib/types";
import Link from "next/link";

function DetailRow({
  labelEn,
  labelAr,
  valueEn,
  valueAr,
}: {
  labelEn: string;
  labelAr: string;
  valueEn: string;
  valueAr: string;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-2 text-sm font-semibold text-[#366FB4] w-1/5">
        {labelEn}
      </td>
      <td className="py-3 px-2 text-sm text-[#2B3D77] text-center">
        {valueEn}
      </td>
      <td className="py-3 px-2 text-sm text-[#2B3D77] text-center" dir="rtl">
        {valueAr}
      </td>
      <td
        className="py-3 px-2 text-sm font-semibold text-[#366FB4] w-1/5 text-right"
        dir="rtl"
      >
        {labelAr}
      </td>
    </tr>
  );
}

function ReportResults({ report }: { report: SickLeaveReport }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#2B3D77] text-white p-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">
            Leave ID: {report.leaveId}
          </span>
          <span className="text-blue-200 text-sm">{report.issueDate}</span>
        </div>
      </div>

      <div className="p-6">
        <table className="w-full">
          <tbody>
            <DetailRow labelEn="Name" labelAr="الاسم" valueEn={report.nameEn} valueAr={report.nameAr} />
            <DetailRow labelEn="National ID / Iqama" labelAr="رقم الهوية / الإقامة" valueEn={report.nationalId} valueAr={report.nationalId} />
            <DetailRow labelEn="Nationality" labelAr="الجنسية" valueEn={report.nationalityEn} valueAr={report.nationalityAr} />
            <DetailRow labelEn="Employer" labelAr="جهة العمل" valueEn={report.employerEn} valueAr={report.employerAr} />
            <DetailRow labelEn="Admission Date" labelAr="تاريخ الدخول" valueEn={report.admissionDate} valueAr={report.admissionDateHijri} />
            <DetailRow labelEn="Discharge Date" labelAr="تاريخ الخروج" valueEn={report.dischargeDate} valueAr={report.dischargeDateHijri} />
            <DetailRow labelEn="Duration" labelAr="مدة الإجازة" valueEn={`${report.durationDays} day(s)`} valueAr={`${report.durationDays} يوم`} />
            <DetailRow labelEn="Practitioner" labelAr="الممارس" valueEn={report.practitionerNameEn} valueAr={report.practitionerNameAr} />
            <DetailRow labelEn="Position" labelAr="المسمى الوظيفي" valueEn={report.positionEn} valueAr={report.positionAr} />
            <DetailRow labelEn="Hospital" labelAr="المستشفى" valueEn={report.hospitalNameEn} valueAr={report.hospitalNameAr} />
          </tbody>
        </table>

        <div className="mt-6 text-center">
          <Link
            href={`/report/${report.id}`}
            className="inline-block bg-[#2B3D77] hover:bg-[#1e2d5a] text-white font-bold py-3 px-8 rounded-lg transition"
          >
            عرض التقرير الكامل وتحميل PDF
            <br />
            <span className="text-sm text-blue-200">View Full Report & Download PDF</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ leaveId?: string }>;
}) {
  const params = await searchParams;
  const leaveId = params.leaveId ?? "";
  const searched = leaveId.length > 0;
  const report = searched ? getReportByLeaveId(leaveId) ?? null : null;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
      }}
    >
      {/* Header */}
      <div className="bg-[#2B3D77] text-white py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <img
            src="/images/seha-logo.png"
            alt="Seha"
            className="w-32 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold mb-1">
            الاستعلام عن تقرير الإجازة المرضية
          </h1>
          <p className="text-blue-200">Sick Leave Report Inquiry</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form action="/inquiry" method="GET" className="flex gap-3">
            <input
              type="text"
              name="leaveId"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
              placeholder="أدخل رمز الإجازة / Enter Leave ID (e.g. GSL26081361937)"
              defaultValue={leaveId}
              dir="ltr"
            />
            <button
              type="submit"
              className="bg-[#2B3D77] hover:bg-[#1e2d5a] text-white font-bold py-3 px-8 rounded-lg transition"
            >
              بحث / Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {searched && !report && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-6xl mb-4">&#128269;</div>
            <p className="text-xl text-red-600 font-semibold mb-2">
              لم يتم العثور على التقرير
            </p>
            <p className="text-gray-500">
              Report not found. Please check the Leave ID and try again.
            </p>
          </div>
        )}

        {report && <ReportResults report={report} />}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-400 text-sm">
        <Link href="/" className="hover:text-[#2B3D77] transition">
          الصفحة الرئيسية / Home
        </Link>
      </div>
    </div>
  );
}
