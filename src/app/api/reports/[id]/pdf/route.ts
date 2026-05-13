import { getReportById } from "@/lib/storage";
import { formatFullDate } from "@/lib/hijri";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";
import { shapeArabicText } from "naqqash";

function loadImageAsBase64(imagePath: string): string {
  const fullPath = path.join(process.cwd(), "public", imagePath);
  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(imagePath).replace(".", "").toLowerCase();
  const mime = ext === "jpg" || ext === "jpeg" ? "jpeg" : "png";
  return `data:image/${mime};base64,${buffer.toString("base64")}`;
}

function loadFont(fontPath: string): string {
  const fullPath = path.join(process.cwd(), "public", fontPath);
  const buffer = fs.readFileSync(fullPath);
  return buffer.toString("base64");
}

function ar(text: string): string {
  return shapeArabicText(text);
}

function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await getReportById(id);

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
  const H = 297;

  // Load and register Arabic fonts
  const amiriRegular = loadFont("fonts/Amiri-Regular.ttf");
  const amiriBold = loadFont("fonts/Amiri-Bold.ttf");
  pdf.addFileToVFS("Amiri-Regular.ttf", amiriRegular);
  pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
  pdf.addFileToVFS("Amiri-Bold.ttf", amiriBold);
  pdf.addFont("Amiri-Bold.ttf", "Amiri", "bold");

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

  function setFont(style: "normal" | "bold") {
    pdf.setFont("Amiri", style);
  }

  function textSmart(text: string, x: number, y: number, options?: { align?: "left" | "center" | "right" }) {
    if (hasArabic(text)) {
      pdf.text(ar(text), x, y, options);
    } else {
      pdf.text(text, x, y, options);
    }
  }

  // ========== PAGE 1 ==========

  // Geometric background top-right
  if (geoBgTop) {
    try { pdf.addImage(geoBgTop, "PNG", W - 80, 0, 80, 28, undefined, "FAST"); } catch { /* skip */ }
  }

  // Header: Seha logo (left) + Kingdom text (center)
  if (sehaLogo) {
    try { pdf.addImage(sehaLogo, "PNG", 10, 10, 30, 18, undefined, "FAST"); } catch { /* skip */ }
  }
  if (kingdomText) {
    try { pdf.addImage(kingdomText, "PNG", 55, 10, 65, 16, undefined, "FAST"); } catch { /* skip */ }
  }

  // Title
  setFont("bold");
  pdf.setFontSize(18);
  pdf.setTextColor(43, 61, 119);
  textSmart("تقرير إجازة مرضية", W / 2, 40, { align: "center" });
  pdf.setFontSize(14);
  pdf.setTextColor(43, 61, 119);
  textSmart("Sick Leave Report", W / 2, 48, { align: "center" });

  // ===== TABLE with 4 columns and full grid =====
  const tableTop = 55;
  const tableLeft = 10;
  const tableRight = W - 10;
  const tableWidth = tableRight - tableLeft;

  // Column positions (4 columns): EnLabel | EnValue | ArValue | ArLabel
  const colWidths = [0.20, 0.30, 0.25, 0.25];
  const colX = [
    tableLeft,
    tableLeft + tableWidth * colWidths[0],
    tableLeft + tableWidth * (colWidths[0] + colWidths[1]),
    tableLeft + tableWidth * (colWidths[0] + colWidths[1] + colWidths[2]),
  ];

  let y = tableTop;
  const rowH = 12;
  const borderColor = { r: 180, g: 180, b: 180 };

  function drawTableRow(
    enLabel: string,
    enValue: string,
    arValue: string,
    arLabel: string,
    isDurationHeader: boolean = false
  ) {
    const cellPad = 3;
    const textY = y + rowH / 2 + 1.5;

    // Fill for duration header row
    if (isDurationHeader) {
      pdf.setFillColor(43, 61, 119);
      pdf.rect(tableLeft, y, tableWidth, rowH, "F");
      pdf.setTextColor(255, 255, 255);
    } else {
      pdf.setTextColor(43, 61, 119);
    }

    // Draw horizontal line at bottom of row
    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
    pdf.setLineWidth(0.3);
    pdf.line(tableLeft, y + rowH, tableRight, y + rowH);

    // Draw vertical column separators
    for (let i = 1; i < 4; i++) {
      pdf.line(colX[i], y, colX[i], y + rowH);
    }

    // Text in each column
    pdf.setFontSize(8);

    // Col 1: English label (left-aligned)
    setFont("bold");
    pdf.text(enLabel, colX[0] + cellPad, textY);

    // Col 2: English value (center-aligned)
    setFont("normal");
    const col2Center = (colX[1] + colX[2]) / 2;
    pdf.text(enValue, col2Center, textY, { align: "center" });

    // Col 3: Arabic value (center-aligned)
    const col3Center = (colX[2] + colX[3]) / 2;
    textSmart(arValue, col3Center, textY, { align: "center" });

    // Col 4: Arabic label (right-aligned, inside cell)
    setFont("bold");
    textSmart(arLabel, tableRight - cellPad, textY, { align: "right" });

    y += rowH;
  }

  // Draw top border of table
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
  pdf.setLineWidth(0.3);
  pdf.line(tableLeft, tableTop, tableRight, tableTop);
  // Draw left and right borders will be drawn at the end

  const durationText = report.durationDays === 1 ? "day" : "days";
  const durationTextAr = report.durationDays === 1 ? "يوم" : "أيام";

  drawTableRow("Leave ID", report.leaveId, "", "رمز الإجازة");
  drawTableRow(
    "Duration",
    `${report.durationDays} ${durationText} (${report.admissionDate} - ${report.dischargeDate})`,
    `${report.durationDays} ${durationTextAr}`,
    "مدة الإجازة",
    true
  );
  drawTableRow("Admission Date", report.admissionDate, report.admissionDateHijri, "تاريخ الدخول");
  drawTableRow("Discharge Date", report.dischargeDate, report.dischargeDateHijri, "تاريخ الخروج");
  drawTableRow("Issue Date", report.issueDate, "", "تاريخ إصدار التقرير");
  drawTableRow("Name", report.nameEn, report.nameAr, "الاسم");
  drawTableRow("National ID / Iqama", report.nationalId, "", "رقم الهوية / الإقامة");
  drawTableRow("Nationality", report.nationalityEn, report.nationalityAr, "الجنسية");
  drawTableRow("Employer", report.employerEn, report.employerAr, "جهة العمل");
  drawTableRow("Practitioner Name", report.practitionerNameEn, report.practitionerNameAr, "اسم الممارس");
  drawTableRow("Position", report.positionEn, report.positionAr, "المسمى الوظيفي");

  // Draw outer border of table (left + right vertical lines)
  const tableBottom = y;
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
  pdf.setLineWidth(0.3);
  pdf.line(tableLeft, tableTop, tableLeft, tableBottom);
  pdf.line(tableRight, tableTop, tableRight, tableBottom);

  // ===== BOTTOM VERIFICATION SECTION =====
  const verifyTop = 210;
  const verifyHeight = 55;
  const verifyLeft = tableLeft;
  const verifyRight = tableRight;

  // Draw border box for verification section
  pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
  pdf.setLineWidth(0.3);
  pdf.rect(verifyLeft, verifyTop, verifyRight - verifyLeft, verifyHeight);

  // Vertical divider in middle
  const verifyMid = W / 2;
  pdf.line(verifyMid, verifyTop, verifyMid, verifyTop + verifyHeight);

  // LEFT half: QR Code + Arabic verification text
  try {
    pdf.addImage(qrDataUrl, "PNG", verifyLeft + 15, verifyTop + 4, 30, 30, undefined, "FAST");
  } catch { /* skip */ }

  setFont("bold");
  pdf.setFontSize(9);
  pdf.setTextColor(43, 61, 119);
  textSmart("للتحقق من بيانات التقرير يرجى التأكد من", (verifyLeft + verifyMid) / 2, verifyTop + 40, { align: "center" });
  textSmart("زيارة موقع منصة صحة الرسمي", (verifyLeft + verifyMid) / 2, verifyTop + 46, { align: "center" });

  // RIGHT half: MOH logo + English text
  if (mohLogo) {
    try {
      pdf.addImage(mohLogo, "JPEG", verifyMid + 25, verifyTop + 4, 30, 25, undefined, "FAST");
    } catch { /* skip */ }
  }

  setFont("bold");
  pdf.setFontSize(8);
  pdf.setTextColor(43, 61, 119);
  pdf.text("To check the report please visit Seha's", (verifyMid + verifyRight) / 2, verifyTop + 38, { align: "center" });
  pdf.text("official website", (verifyMid + verifyRight) / 2, verifyTop + 43, { align: "center" });

  // Kingdom text at bottom of page 1
  if (kingdomText) {
    try {
      pdf.addImage(kingdomText, "PNG", 10, H - 25, 60, 15, "kingdomBottom", "FAST");
    } catch { /* skip */ }
  }

  // Geometric background bottom-left
  if (geoBgBottom) {
    try { pdf.addImage(geoBgBottom, "PNG", 0, H - 30, 80, 28, undefined, "FAST"); } catch { /* skip */ }
  }

  // ========== PAGE 2 ==========
  pdf.addPage();

  // Hospital names
  pdf.setFontSize(14);
  setFont("bold");
  pdf.setTextColor(51, 51, 51);
  textSmart(report.hospitalNameAr, 15, 20);
  pdf.text(report.hospitalNameEn, W - 15, 20, { align: "right" });

  // Separator line
  pdf.setDrawColor(204, 204, 204);
  pdf.setLineWidth(0.5);
  pdf.line(15, 25, W - 15, 25);

  // Inquiry link
  pdf.setFont("Helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(47, 109, 180);
  pdf.textWithLink(inquiryUrl, 15, 35, { url: inquiryUrl });

  // Time and Date
  setFont("normal");
  pdf.setFontSize(10);
  pdf.setTextColor(51, 51, 51);
  pdf.text(
    new Date(report.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    15,
    45
  );
  pdf.text(formatFullDate(report.issueDate), 15, 52);

  // NHIC Logo on page 2 (right side)
  if (nhicLogo) {
    try { pdf.addImage(nhicLogo, "PNG", W - 55, 30, 40, 25, undefined, "FAST"); } catch { /* skip */ }
  }

  // Add clickable link on QR area of page 1
  pdf.setPage(1);
  pdf.link(verifyLeft + 15, verifyTop + 4, 30, 30, { url: inquiryUrl });

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sick-leave-report-${report.leaveId}.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
