import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #1a2a5e 0%, #2B3D77 50%, #366FB4 100%)",
      }}
    >
      {/* Header */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/images/seha-logo.png"
              alt="Seha"
              className="w-40 mx-auto mb-6"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            نظام الإجازات الطبية
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-200 mb-8">
            Medical Leave System
          </h2>

          <p className="text-blue-100 text-lg mb-12 leading-relaxed">
            نظام إلكتروني لإنشاء وإدارة تقارير الإجازات المرضية
            <br />
            Electronic system for creating and managing sick leave reports
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-white text-[#2B3D77] font-bold py-4 px-10 rounded-xl text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="block">إنشاء تقرير جديد</span>
              <span className="text-sm text-gray-500">
                Create New Report
              </span>
            </Link>
            <Link
              href="/inquiry"
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              <span className="block">استعلام عن تقرير</span>
              <span className="text-sm text-blue-200">
                Report Inquiry
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Logos */}
      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 opacity-60">
          <img
            src="/images/moh-logo.jpeg"
            alt="Ministry of Health"
            className="h-16"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <img
            src="/images/nhic-logo.png"
            alt="NHIC"
            className="h-16"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      </div>
    </div>
  );
}
