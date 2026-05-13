import type { SickLeaveReport } from "@/lib/types";
import { formatFullDate } from "@/lib/hijri";

interface Props {
  report: SickLeaveReport;
  baseUrl: string;
  qrDataUrl: string;
}

export default function ReportTemplate({ report, baseUrl, qrDataUrl }: Props) {
  const inquiryUrl = `${baseUrl}/inquiry?leaveId=${report.leaveId}`;

  const durationText =
    report.durationDays === 1 ? "day" : "days";
  const durationTextAr = report.durationDays === 1 ? "يوم" : "أيام";

  return (
    <div
      id="report-content"
      style={{
        width: "842px",
        minHeight: "1191px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        color: "#2B3D77",
        direction: "ltr",
      }}
    >
      {/* Page 1 */}
      <div
        style={{
          width: "842px",
          height: "1191px",
          position: "relative",
          overflow: "hidden",
          pageBreakAfter: "always",
        }}
      >
        {/* Geometric decoration top-right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "350px",
            height: "120px",
            opacity: 0.4,
          }}
        >
          <img
            src="/images/geometric-bg-top.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Geometric decoration bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "350px",
            height: "120px",
            opacity: 0.4,
            transform: "rotate(180deg)",
          }}
        >
          <img
            src="/images/geometric-bg-bottom.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Header section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px 10px 40px",
          }}
        >
          {/* Seha Logo */}
          <div style={{ width: "140px" }}>
            <img
              src="/images/seha-logo.png"
              alt="Seha"
              style={{ width: "140px", height: "auto" }}
            />
          </div>

          {/* Kingdom text */}
          <div style={{ textAlign: "center" }}>
            <img
              src="/images/kingdom-text.png"
              alt="Kingdom of Saudi Arabia"
              style={{ width: "280px", height: "auto" }}
            />
          </div>

          {/* Empty space for geometric pattern */}
          <div style={{ width: "140px" }} />
        </div>

        {/* Title */}
        <div
          style={{
            textAlign: "center",
            margin: "15px 0 5px 0",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#2F6DB4",
              margin: 0,
              fontFamily: "Arial, sans-serif",
            }}
          >
            تقرير إجازة مرضية
          </h1>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#2F6DB4",
              margin: "5px 0 0 0",
            }}
          >
            Sick Leave Report
          </h2>
        </div>

        {/* Main content table */}
        <div style={{ padding: "10px 35px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #e0e0e0",
            }}
          >
            <tbody>
              {/* Leave ID Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    width: "18%",
                    borderBottom: "1px solid #e0e0e0",
                    verticalAlign: "middle",
                  }}
                >
                  Leave ID
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                  colSpan={2}
                >
                  {report.leaveId}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    width: "18%",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                    verticalAlign: "middle",
                  }}
                >
                  رمز الإجازة
                </td>
              </tr>

              {/* Duration Row - Blue bar */}
              <tr
                style={{
                  background: "#2B3D77",
                }}
              >
                <td
                  style={{
                    padding: "10px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Duration
                </td>
                <td
                  style={{
                    padding: "10px 15px",
                    fontSize: "13px",
                    color: "#FFFFFF",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.durationDays} {durationText} ({" "}
                  {report.admissionDate} to {report.dischargeDate} )
                  <br />
                  <span style={{ direction: "rtl", display: "inline-block" }}>
                    ({report.dischargeDateHijri}) إلى ({report.admissionDateHijri})
                  </span>
                </td>
                <td
                  style={{
                    padding: "10px 15px",
                    fontSize: "13px",
                    color: "#FFFFFF",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  {report.durationDays} {durationTextAr}
                </td>
                <td
                  style={{
                    padding: "10px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  مدة الإجازة
                </td>
              </tr>

              {/* Admission Date Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Admission Date
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.admissionDate}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.admissionDateHijri}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  تاريخ الدخول
                </td>
              </tr>

              {/* Discharge Date Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Discharge Date
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.dischargeDate}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.dischargeDateHijri}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  تاريخ الخروج
                </td>
              </tr>

              {/* Issue Date Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Issue Date
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                  colSpan={2}
                >
                  {report.issueDate}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  تاريخ إصدار التقرير
                </td>
              </tr>

              {/* Name Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Name
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.nameEn}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  {report.nameAr}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  الاسم
                </td>
              </tr>

              {/* National ID Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  National ID / Iqama
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                  colSpan={2}
                >
                  {report.nationalId}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  رقم الهوية / الإقامة
                </td>
              </tr>

              {/* Nationality Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Nationality
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.nationalityEn}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  {report.nationalityAr}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  الجنسية
                </td>
              </tr>

              {/* Employer Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Employer
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.employerEn}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  {report.employerAr}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  جهة العمل
                </td>
              </tr>

              {/* Practitioner Name Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  Practitioner Name
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {report.practitionerNameEn}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  {report.practitionerNameAr}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    borderBottom: "1px solid #e0e0e0",
                    direction: "rtl",
                  }}
                >
                  اسم الممارس
                </td>
              </tr>

              {/* Position Row */}
              <tr>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                  }}
                >
                  Position
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                  }}
                >
                  {report.positionEn}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    color: "#2B3D77",
                    textAlign: "center",
                    direction: "rtl",
                  }}
                >
                  {report.positionAr}
                </td>
                <td
                  style={{
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#366FB4",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  المسمى الوظيفي
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom section - QR Code and Ministry Logo */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "35px",
            right: "35px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {/* QR Code */}
            <div style={{ textAlign: "center" }}>
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  style={{ width: "150px", height: "150px" }}
                />
              )}
            </div>

            {/* Verification text */}
            <div style={{ textAlign: "center", flex: 1, padding: "0 20px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: "0 0 3px 0",
                  direction: "rtl",
                }}
              >
                للتحقق من بيانات التقرير يرجى التأكد من زيارة موقع منصة صحة
                الرسمي
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: 0,
                }}
              >
                To check the report please visit Seha&apos;s official website
              </p>
            </div>

            {/* Ministry of Health Logo */}
            <div style={{ textAlign: "center" }}>
              <img
                src="/images/moh-logo.jpeg"
                alt="Ministry of Health"
                style={{ width: "120px", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Page 2 */}
      <div
        style={{
          width: "842px",
          height: "1191px",
          position: "relative",
          overflow: "hidden",
          pageBreakBefore: "always",
        }}
      >
        {/* Hospital Name & Link */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "30px 40px 20px 40px",
            borderBottom: "2px solid #ccc",
          }}
        >
          <div style={{ direction: "rtl" }}>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                margin: 0,
              }}
            >
              {report.hospitalNameAr}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                margin: 0,
              }}
            >
              {report.hospitalNameEn}
            </p>
          </div>
        </div>

        {/* Link */}
        <div style={{ padding: "10px 40px" }}>
          <a
            href={inquiryUrl}
            style={{
              fontSize: "14px",
              color: "#2F6DB4",
              textDecoration: "underline",
            }}
          >
            {inquiryUrl}
          </a>
        </div>

        {/* Time and Date */}
        <div style={{ padding: "10px 40px" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#333",
              margin: "0 0 5px 0",
            }}
          >
            {new Date(report.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <p
            style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: 0 }}
          >
            {formatFullDate(report.issueDate)}
          </p>
        </div>

        {/* NHIC Logo */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "40px",
          }}
        >
          <img
            src="/images/nhic-logo.png"
            alt="NHIC"
            style={{ width: "150px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
