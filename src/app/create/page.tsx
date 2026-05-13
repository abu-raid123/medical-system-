"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  nameEn: string;
  nameAr: string;
  nationalId: string;
  nationalityEn: string;
  nationalityAr: string;
  employerEn: string;
  employerAr: string;
  admissionDate: string;
  dischargeDate: string;
  issueDate: string;
  practitionerNameEn: string;
  practitionerNameAr: string;
  positionEn: string;
  positionAr: string;
  hospitalNameEn: string;
  hospitalNameAr: string;
}

function toDateInputValue(dateStr: string): string {
  if (!dateStr) return "";
  const [d, m, y] = dateStr.split("-");
  return `${y}-${m}-${d}`;
}

function fromDateInputValue(val: string): string {
  if (!val) return "";
  const [y, m, d] = val.split("-");
  return `${d}-${m}-${y}`;
}

function gregorianToHijriClient(dateStr: string): string {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-").map(Number);
  const gDate = new Date(year, month - 1, day);

  const formatter = new Intl.DateTimeFormat("en-SA-u-ca-islamic-umalqura", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const parts = formatter.formatToParts(gDate);
  const hDay = parts.find((p) => p.type === "day")?.value ?? "";
  const hMonth = parts.find((p) => p.type === "month")?.value ?? "";
  const hYear = parts.find((p) => p.type === "year")?.value ?? "";

  return `${hDay}-${hMonth}-${hYear}`;
}

function calculateDurationDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const [d1, m1, y1] = start.split("-").map(Number);
  const [d2, m2, y2] = end.split("-").map(Number);
  const s = new Date(y1, m1 - 1, d1);
  const e = new Date(y2, m2 - 1, d2);
  const diff = Math.abs(e.getTime() - s.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

  const [form, setForm] = useState<FormData>({
    nameEn: "",
    nameAr: "",
    nationalId: "",
    nationalityEn: "",
    nationalityAr: "",
    employerEn: "",
    employerAr: "",
    admissionDate: todayStr,
    dischargeDate: todayStr,
    issueDate: todayStr,
    practitionerNameEn: "",
    practitionerNameAr: "",
    positionEn: "",
    positionAr: "",
    hospitalNameEn: "",
    hospitalNameAr: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof FormData, inputValue: string) => {
    const dmyValue = fromDateInputValue(inputValue);
    setForm((prev) => ({ ...prev, [field]: dmyValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const admissionDateHijri = gregorianToHijriClient(form.admissionDate);
    const dischargeDateHijri = gregorianToHijriClient(form.dischargeDate);
    const durationDays = calculateDurationDays(
      form.admissionDate,
      form.dischargeDate
    );

    const payload = {
      ...form,
      admissionDateHijri,
      dischargeDateHijri,
      durationDays,
    };

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/report/${data.id}`);
    } else {
      alert("حدث خطأ أثناء حفظ التقرير");
      setLoading(false);
    }
  };

  const fieldLabelStyle =
    "block text-sm font-semibold text-gray-700 mb-1";
  const inputStyle =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
      }}
    >
      {/* Header */}
      <div className="bg-[#2B3D77] text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sick Leave Report</h1>
              <p className="text-blue-200 text-sm mt-1">
                Enter patient information below
              </p>
            </div>
            <div className="text-right" dir="rtl">
              <h1 className="text-2xl font-bold">تقرير إجازة مرضية</h1>
              <p className="text-blue-200 text-sm mt-1">
                أدخل بيانات المريض أدناه
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-[#2B3D77] border-b pb-3 mb-4 flex justify-between">
            <span>Patient Information</span>
            <span dir="rtl">بيانات المريض</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={fieldLabelStyle}>Name (English)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. MOHAMMED AL-BARIQI"
                value={form.nameEn}
                onChange={(e) => handleChange("nameEn", e.target.value)}
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>الاسم (عربي)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="مثال: محمد البارقي"
                value={form.nameAr}
                onChange={(e) => handleChange("nameAr", e.target.value)}
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>National ID / Iqama</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. 1126692415"
                value={form.nationalId}
                onChange={(e) => handleChange("nationalId", e.target.value)}
                required
              />
            </div>
            <div />

            <div>
              <label className={fieldLabelStyle}>Nationality (English)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. Saudi Arabia"
                value={form.nationalityEn}
                onChange={(e) => handleChange("nationalityEn", e.target.value)}
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>الجنسية (عربي)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="مثال: السعودية"
                value={form.nationalityAr}
                onChange={(e) => handleChange("nationalityAr", e.target.value)}
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>Employer (English)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. Private Sector"
                value={form.employerEn}
                onChange={(e) => handleChange("employerEn", e.target.value)}
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>جهة العمل (عربي)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="مثال: قطاع خاص"
                value={form.employerAr}
                onChange={(e) => handleChange("employerAr", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-[#2B3D77] border-b pb-3 mb-4 flex justify-between">
            <span>Dates</span>
            <span dir="rtl">التواريخ</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={fieldLabelStyle}>
                Admission Date / تاريخ الدخول
              </label>
              <input
                type="date"
                className={inputStyle}
                value={toDateInputValue(form.admissionDate)}
                onChange={(e) =>
                  handleDateChange("admissionDate", e.target.value)
                }
                required
              />
              {form.admissionDate && (
                <p className="text-xs text-gray-500 mt-1" dir="rtl">
                  هجري: {gregorianToHijriClient(form.admissionDate)}
                </p>
              )}
            </div>
            <div>
              <label className={fieldLabelStyle}>
                Discharge Date / تاريخ الخروج
              </label>
              <input
                type="date"
                className={inputStyle}
                value={toDateInputValue(form.dischargeDate)}
                onChange={(e) =>
                  handleDateChange("dischargeDate", e.target.value)
                }
                required
              />
              {form.dischargeDate && (
                <p className="text-xs text-gray-500 mt-1" dir="rtl">
                  هجري: {gregorianToHijriClient(form.dischargeDate)}
                </p>
              )}
            </div>
            <div>
              <label className={fieldLabelStyle}>
                Issue Date / تاريخ الإصدار
              </label>
              <input
                type="date"
                className={inputStyle}
                value={toDateInputValue(form.issueDate)}
                onChange={(e) => handleDateChange("issueDate", e.target.value)}
                required
              />
            </div>
          </div>

          {form.admissionDate && form.dischargeDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-[#2B3D77] font-semibold">
                Duration / مدة الإجازة:{" "}
                <span className="text-lg">
                  {calculateDurationDays(
                    form.admissionDate,
                    form.dischargeDate
                  )}
                </span>{" "}
                day(s) / يوم
              </p>
            </div>
          )}
        </div>

        {/* Practitioner & Hospital */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-[#2B3D77] border-b pb-3 mb-4 flex justify-between">
            <span>Practitioner & Hospital</span>
            <span dir="rtl">الممارس والمستشفى</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={fieldLabelStyle}>
                Practitioner Name (English)
              </label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. YASSIN HUSSEIN"
                value={form.practitionerNameEn}
                onChange={(e) =>
                  handleChange("practitionerNameEn", e.target.value)
                }
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>اسم الممارس (عربي)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="مثال: ياسين حسين"
                value={form.practitionerNameAr}
                onChange={(e) =>
                  handleChange("practitionerNameAr", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>Position (English)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. General"
                value={form.positionEn}
                onChange={(e) => handleChange("positionEn", e.target.value)}
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>المسمى الوظيفي (عربي)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="مثال: طبيب عام"
                value={form.positionAr}
                onChange={(e) => handleChange("positionAr", e.target.value)}
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>
                Hospital Name (English)
              </label>
              <input
                type="text"
                className={inputStyle}
                placeholder="e.g. East Jeddah Hospital"
                value={form.hospitalNameEn}
                onChange={(e) => handleChange("hospitalNameEn", e.target.value)}
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>اسم المستشفى (عربي)</label>
              <input
                type="text"
                className={inputStyle}
                placeholder="مثال: مستشفى شرق جدة"
                value={form.hospitalNameAr}
                onChange={(e) => handleChange("hospitalNameAr", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2B3D77] hover:bg-[#1e2d5a] text-white font-bold py-3 px-12 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                جاري الحفظ...
              </span>
            ) : (
              <span>حفظ وإنشاء التقرير / Save & Generate Report</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
