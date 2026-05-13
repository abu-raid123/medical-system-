import { getReportById } from "@/lib/storage";
import { formatFullDate } from "@/lib/hijri";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";

function loadImageAsBase64(imagePath: string): string {
  const fullPath = path.join(process.cwd(), "public", imagePath);
  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(imagePath).replace(".", "").toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "jpeg" : "png";
  return `data:image/${mime};base64,${buffer.toString("base64")}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    return new Response("Report not found", { status: 404 });
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;
  const inquiryUrl = `${baseUrl}/inquiry?leaveId=${report.leaveId}`;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;

  // Load images
  let sehaLogo: string | null = null;
  let kingdomText: string | null = null;
  let mohLogo: string | null = null;
  let nhicLogo: string | null = null;
  let geoBgTop: string | null = null;
  let geoBgBottom: string | null = null;

  try { sehaLogo = loadImageAsBase64("images/seha-logo.png"); } catch { /* skip */ }
  try { kingdomText = loadImageAsBase64("images/kingdom-text.png"); } catch { /* skip */ }
  try { mohLogo = loadImageAsBase64("images/moh-logo.jpeg"); } catch { /* skip */ }
  try { nhicLogo = loadImageAsBase64("images/nhic-logo.png"); } catch { /* skip */ }
  try { geoBgTop = loadImageAsBase64("images/geometric-bg-top.png"); } catch { /* skip */ }
  try { geoBgBottom = loadImageAsBase64("images/geometric-bg-bottom.png"); } catch { /* skip */ }

  // Generate QR code
  const qrDataUrl = await QRCode.toDataURL(inquiryUrl, {
    width: 300,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // ========== PAGE 1 ==========

  // Geometric backgrounds
  if (geoBgTop) {
    try { pdf.addImage(geoBgTop, "PNG", W - 90, 0, 90, 30, undefined, "FAST"); } catch { /* skip */ }
  }
  if (geoBgBottom) {
    try { pdf.addImage(geoBgBottom, "PNG", 0, 267, 90, 30, undefined, "FAST"); } catch { /* skip */ }
  }

  // Header: Seha logo + Kingdom text
  if (sehaLogo) {
    try { pdf.addImage(sehaLogo, "PNG", 12, 8, 35, 20, undefined, "FAST"); } catch { /* skip */ }
  }
  if (kingdomText) {
    try { pdf.addImage(kingdomText, "PNG", 60, 8, 70, 18, undefined, "FAST"); } catch { /* skip */ }
  }

  // Title
  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(47, 109, 180);
  pdf.text("تقرير إجازة مرضية", W / 2, 42, { align: "center" });
  pdf.setFontSize(17);
  pdf.text("Sick Leave Report", W / 2, 50, { align: "center" });

  // Table
  const tableTop = 58;
  const tableLeft = 12;
  const tableRight = W - 12;
  const tableWidth = tableRight - tableLeft;
  const col1 = tableLeft;
  const col2 = tableLeft + tableWidth * 0.18;
  const col3 = tableLeft + tableWidth * 0.5;
  const col4 = tableLeft + tableWidth * 0.82;
  let y = tableTop;
  const rowH = 11;

  function drawRow(
    leftLabel: string,
    centerValue: string,
    centerValue2: string,
    rightLabel: string,
    isHeader: boolean = false
  ) {
    if (isHeader) {
      pdf.setFillColor(43, 61, 119);
      pdf.rect(tableLeft, y, tableWidth, rowH, "F");
      pdf.setTextColor(255, 255, 255);
    } else {
      pdf.setDrawColor(224, 224, 224);
      pdf.line(tableLeft, y + rowH, tableRight, y + rowH);
      pdf.setTextColor(43, 61, 119);
    }

    const textY = y + rowH * 0.65;
    pdf.setFontSize(9);
    pdf.setFont("Helvetica", "bold");
    pdf.text(leftLabel, col1 + 3, textY);
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(centerValue, (col2 + col3) / 2, textY, { align: "center" });
    pdf.text(centerValue2, (col3 + col4) / 2, textY, { align: "center" });
    pdf.setFont("Helvetica", "bold");
    pdf.text(rightLabel, tableRight - 3, textY, { align: "right" });

    y += rowH;
  }

  // Draw table border
  pdf.setDrawColor(224, 224, 224);

  const durationText = report.durationDays === 1 ? "day" : "days";
  const durationTextAr = report.durationDays === 1 ? "يوم" : "أيام";

  drawRow("Leave ID", report.leaveId, "", "رمز الإجازة");
  drawRow(
    "Duration",
    `${report.durationDays} ${durationText} (${report.admissionDate} - ${report.dischargeDate})`,
    `${report.durationDays} ${durationTextAr}`,
    "مدة الإجازة",
    true
  );
  drawRow("Admission Date", report.admissionDate, report.admissionDateHijri, "تاريخ الدخول");
  drawRow("Discharge Date", report.dischargeDate, report.dischargeDateHijri, "تاريخ الخروج");
  drawRow("Issue Date", report.issueDate, "", "تاريخ إصدار التقرير");
  drawRow("Name", report.nameEn, report.nameAr, "الاسم");
  drawRow("National ID / Iqama", report.nationalId, "", "رقم الهوية / الإقامة");
  drawRow("Nationality", report.nationalityEn, report.nationalityAr, "الجنسية");
  drawRow("Employer", report.employerEn, report.employerAr, "جهة العمل");
  drawRow("Practitioner Name", report.practitionerNameEn, report.practitionerNameAr, "اسم الممارس");
  drawRow("Position", report.positionEn, report.positionAr, "المسمى الوظيفي");

  // Draw table outer border
  pdf.setDrawColor(224, 224, 224);
  pdf.rect(tableLeft, tableTop, tableWidth, y - tableTop);

  // QR Code + verification text + MOH logo at bottom of page 1
  const bottomY = 230;

  // QR Code
  try { pdf.addImage(qrDataUrl, "PNG", 15, bottomY, 35, 35, undefined, "FAST"); } catch { /* skip */ }

  // Verification text
  pdf.setFontSize(8);
  pdf.setTextColor(51, 51, 51);
  pdf.setFont("Helvetica", "bold");
  pdf.text("للتحقق من بيانات التقرير يرجى التأكد من زيارة موقع منصة صحة الرسمي", W / 2, bottomY + 14, { align: "center" });
  pdf.text("To check the report please visit Seha's official website", W / 2, bottomY + 20, { align: "center" });

  // MOH Logo
  if (mohLogo) {
    try { pdf.addImage(mohLogo, "JPEG", W - 50, bottomY, 30, 30, undefined, "FAST"); } catch { /* skip */ }
  }

  // ========== PAGE 2 ==========
  pdf.addPage();

  // Hospital names
  pdf.setFontSize(12);
  pdf.setFont("Helvetica", "bold");
  pdf.setTextColor(51, 51, 51);
  pdf.text(report.hospitalNameAr, 15, 18);
  pdf.text(report.hospitalNameEn, W - 15, 18, { align: "right" });

  // Separator line
  pdf.setDrawColor(204, 204, 204);
  pdf.setLineWidth(0.5);
  pdf.line(15, 22, W - 15, 22);

  // NHIC Logo
  if (nhicLogo) {
    try { pdf.addImage(nhicLogo, "PNG", W - 55, 25, 40, 25, undefined, "FAST"); } catch { /* skip */ }
  }

  // Inquiry link
  pdf.setFontSize(10);
  pdf.setTextColor(47, 109, 180);
  pdf.textWithLink(inquiryUrl, 15, 30, { url: inquiryUrl });

  // Time and Date
  pdf.setFontSize(10);
  pdf.setTextColor(51, 51, 51);
  pdf.text(
    new Date(report.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    15,
    40
  );
  pdf.text(formatFullDate(report.issueDate), 15, 46);

  // Add clickable link on QR area of page 1
  pdf.setPage(1);
  pdf.link(15, bottomY, 35, 35, { url: inquiryUrl });

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sick-leave-report-${report.leaveId}.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
