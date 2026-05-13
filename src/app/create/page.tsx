import { createReportAction } from "./actions";
import FormAutoSave from "@/components/FormAutoSave";

export default function CreatePage() {
  const today = new Date().toISOString().split("T")[0];

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

      <FormAutoSave />
      <form action={createReportAction} className="max-w-4xl mx-auto px-4 py-8">
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
                name="nameEn"
                className={inputStyle}
                placeholder="e.g. MOHAMMED AL-BARIQI"
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>الاسم (عربي)</label>
              <input
                type="text"
                name="nameAr"
                className={inputStyle}
                placeholder="مثال: محمد البارقي"
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>National ID / Iqama</label>
              <input
                type="text"
                name="nationalId"
                className={inputStyle}
                placeholder="e.g. 1126692415"
                required
              />
            </div>
            <div />

            <div>
              <label className={fieldLabelStyle}>Nationality (English)</label>
              <input
                type="text"
                name="nationalityEn"
                className={inputStyle}
                placeholder="e.g. Saudi Arabia"
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>الجنسية (عربي)</label>
              <input
                type="text"
                name="nationalityAr"
                className={inputStyle}
                placeholder="مثال: السعودية"
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>Employer (English)</label>
              <input
                type="text"
                name="employerEn"
                className={inputStyle}
                placeholder="e.g. Private Sector"
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>جهة العمل (عربي)</label>
              <input
                type="text"
                name="employerAr"
                className={inputStyle}
                placeholder="مثال: قطاع خاص"
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
                name="admissionDate"
                className={inputStyle}
                defaultValue={today}
                required
              />
            </div>
            <div>
              <label className={fieldLabelStyle}>
                Discharge Date / تاريخ الخروج
              </label>
              <input
                type="date"
                name="dischargeDate"
                className={inputStyle}
                defaultValue={today}
                required
              />
            </div>
            <div>
              <label className={fieldLabelStyle}>
                Issue Date / تاريخ الإصدار
              </label>
              <input
                type="date"
                name="issueDate"
                className={inputStyle}
                defaultValue={today}
                required
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * يتم تحويل التاريخ الهجري ومدة الإجازة تلقائياً عند الحفظ
            <br />
            * Hijri dates and duration are calculated automatically on save
          </p>
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
                name="practitionerNameEn"
                className={inputStyle}
                placeholder="e.g. YASSIN HUSSEIN"
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>اسم الممارس (عربي)</label>
              <input
                type="text"
                name="practitionerNameAr"
                className={inputStyle}
                placeholder="مثال: ياسين حسين"
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>Position (English)</label>
              <input
                type="text"
                name="positionEn"
                className={inputStyle}
                placeholder="e.g. General"
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>المسمى الوظيفي (عربي)</label>
              <input
                type="text"
                name="positionAr"
                className={inputStyle}
                placeholder="مثال: طبيب عام"
                required
              />
            </div>

            <div>
              <label className={fieldLabelStyle}>
                Hospital Name (English)
              </label>
              <input
                type="text"
                name="hospitalNameEn"
                className={inputStyle}
                placeholder="e.g. East Jeddah Hospital"
                required
              />
            </div>
            <div dir="rtl">
              <label className={fieldLabelStyle}>اسم المستشفى (عربي)</label>
              <input
                type="text"
                name="hospitalNameAr"
                className={inputStyle}
                placeholder="مثال: مستشفى شرق جدة"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#2B3D77] hover:bg-[#1e2d5a] text-white font-bold py-3 px-12 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
          >
            حفظ وإنشاء التقرير / Save & Generate Report
          </button>
        </div>
      </form>
    </div>
  );
}
