export interface SickLeaveReport {
  id: string;
  leaveId: string;
  // Patient info
  nameEn: string;
  nameAr: string;
  nationalId: string;
  nationalityEn: string;
  nationalityAr: string;
  employerEn: string;
  employerAr: string;
  // Dates (Gregorian)
  admissionDate: string;
  dischargeDate: string;
  issueDate: string;
  // Dates (Hijri)
  admissionDateHijri: string;
  dischargeDateHijri: string;
  // Duration
  durationDays: number;
  // Practitioner info
  practitionerNameEn: string;
  practitionerNameAr: string;
  positionEn: string;
  positionAr: string;
  // Hospital info
  hospitalNameEn: string;
  hospitalNameAr: string;
  // Timestamps
  createdAt: string;
}
