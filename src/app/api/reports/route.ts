import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveReport, getReportByLeaveId } from "@/lib/storage";
import { generateLeaveId } from "@/lib/hijri";
import type { SickLeaveReport } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();

  const id = uuidv4();
  const leaveId = generateLeaveId();

  const report: SickLeaveReport = {
    id,
    leaveId,
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    nationalId: body.nationalId,
    nationalityEn: body.nationalityEn,
    nationalityAr: body.nationalityAr,
    employerEn: body.employerEn,
    employerAr: body.employerAr,
    admissionDate: body.admissionDate,
    dischargeDate: body.dischargeDate,
    issueDate: body.issueDate,
    admissionDateHijri: body.admissionDateHijri,
    dischargeDateHijri: body.dischargeDateHijri,
    durationDays: body.durationDays,
    practitionerNameEn: body.practitionerNameEn,
    practitionerNameAr: body.practitionerNameAr,
    positionEn: body.positionEn,
    positionAr: body.positionAr,
    hospitalNameEn: body.hospitalNameEn,
    hospitalNameAr: body.hospitalNameAr,
    createdAt: new Date().toISOString(),
  };

  await saveReport(report);

  return NextResponse.json({ success: true, id, leaveId });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leaveId = searchParams.get("leaveId");

  if (!leaveId) {
    return NextResponse.json(
      { error: "leaveId is required" },
      { status: 400 }
    );
  }

  const report = await getReportByLeaveId(leaveId);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json(report);
}
