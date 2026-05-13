"use server";

import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { saveReport } from "@/lib/storage";
import { generateLeaveId, gregorianToHijri, calculateDuration } from "@/lib/hijri";
import type { SickLeaveReport } from "@/lib/types";

function isoToInternalDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
}

export async function createReportAction(formData: FormData) {
  const nameEn = formData.get("nameEn") as string;
  const nameAr = formData.get("nameAr") as string;
  const nationalId = formData.get("nationalId") as string;
  const nationalityEn = formData.get("nationalityEn") as string;
  const nationalityAr = formData.get("nationalityAr") as string;
  const employerEn = formData.get("employerEn") as string;
  const employerAr = formData.get("employerAr") as string;
  const admissionDateISO = formData.get("admissionDate") as string;
  const dischargeDateISO = formData.get("dischargeDate") as string;
  const issueDateISO = formData.get("issueDate") as string;
  const practitionerNameEn = formData.get("practitionerNameEn") as string;
  const practitionerNameAr = formData.get("practitionerNameAr") as string;
  const positionEn = formData.get("positionEn") as string;
  const positionAr = formData.get("positionAr") as string;
  const hospitalNameEn = formData.get("hospitalNameEn") as string;
  const hospitalNameAr = formData.get("hospitalNameAr") as string;

  const admissionDate = isoToInternalDate(admissionDateISO);
  const dischargeDate = isoToInternalDate(dischargeDateISO);
  const issueDate = isoToInternalDate(issueDateISO);

  const admissionDateHijri = gregorianToHijri(admissionDate);
  const dischargeDateHijri = gregorianToHijri(dischargeDate);
  const durationDays = calculateDuration(admissionDate, dischargeDate);

  const id = uuidv4();
  const leaveId = generateLeaveId();

  const report: SickLeaveReport = {
    id,
    leaveId,
    nameEn,
    nameAr,
    nationalId,
    nationalityEn,
    nationalityAr,
    employerEn,
    employerAr,
    admissionDate,
    dischargeDate,
    issueDate,
    admissionDateHijri,
    dischargeDateHijri,
    durationDays,
    practitionerNameEn,
    practitionerNameAr,
    positionEn,
    positionAr,
    hospitalNameEn,
    hospitalNameAr,
    createdAt: new Date().toISOString(),
  };

  saveReport(report);

  redirect(`/report/${id}`);
}
