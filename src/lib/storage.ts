import type { SickLeaveReport } from "./types";

// ===== Supabase storage (production) =====
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

function createSupabaseClient() {
  const { createClient } = require("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getSupabase() {
  if (supabaseClient === undefined || supabaseClient === null) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
}

function useSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// ===== JSON file storage (local fallback) =====
function getFs() {
  const fs = require("fs");
  const path = require("path");
  return { fs, path };
}

function getDataFile() {
  const { fs, path } = getFs();
  const DATA_DIR = path.join(process.cwd(), "data");
  const DATA_FILE = path.join(DATA_DIR, "reports.json");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
  return DATA_FILE;
}

function getAllReportsLocal(): SickLeaveReport[] {
  const { fs } = getFs();
  const raw = fs.readFileSync(getDataFile(), "utf-8");
  return JSON.parse(raw) as SickLeaveReport[];
}

function saveReportLocal(report: SickLeaveReport): void {
  const { fs } = getFs();
  const reports = getAllReportsLocal();
  reports.push(report);
  fs.writeFileSync(getDataFile(), JSON.stringify(reports, null, 2), "utf-8");
}

// ===== Public API =====

export async function getAllReports(): Promise<SickLeaveReport[]> {
  if (useSupabase()) {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb.from("reports").select("*").order("created_at", { ascending: false });
    if (error) { console.error("Supabase error:", error); return []; }
    return (data || []).map(mapFromDb);
  }
  return getAllReportsLocal();
}

export async function getReportById(id: string): Promise<SickLeaveReport | null> {
  if (useSupabase()) {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb.from("reports").select("*").eq("id", id).single();
    if (error || !data) return null;
    return mapFromDb(data);
  }
  return getAllReportsLocal().find((r) => r.id === id) ?? null;
}

export async function getReportByLeaveId(leaveId: string): Promise<SickLeaveReport | null> {
  if (useSupabase()) {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb.from("reports").select("*").eq("leave_id", leaveId).single();
    if (error || !data) return null;
    return mapFromDb(data);
  }
  return getAllReportsLocal().find((r) => r.leaveId === leaveId) ?? null;
}

export async function saveReport(report: SickLeaveReport): Promise<void> {
  if (useSupabase()) {
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from("reports").insert(mapToDb(report));
    if (error) { console.error("Supabase insert error:", error); }
    return;
  }
  saveReportLocal(report);
}

// ===== DB field mapping (snake_case <-> camelCase) =====

interface DbRow {
  id: string;
  leave_id: string;
  name_en: string;
  name_ar: string;
  national_id: string;
  nationality_en: string;
  nationality_ar: string;
  employer_en: string;
  employer_ar: string;
  admission_date: string;
  discharge_date: string;
  issue_date: string;
  admission_date_hijri: string;
  discharge_date_hijri: string;
  duration_days: number;
  practitioner_name_en: string;
  practitioner_name_ar: string;
  position_en: string;
  position_ar: string;
  hospital_name_en: string;
  hospital_name_ar: string;
  created_at: string;
}

function mapFromDb(row: DbRow): SickLeaveReport {
  return {
    id: row.id,
    leaveId: row.leave_id,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    nationalId: row.national_id,
    nationalityEn: row.nationality_en,
    nationalityAr: row.nationality_ar,
    employerEn: row.employer_en,
    employerAr: row.employer_ar,
    admissionDate: row.admission_date,
    dischargeDate: row.discharge_date,
    issueDate: row.issue_date,
    admissionDateHijri: row.admission_date_hijri,
    dischargeDateHijri: row.discharge_date_hijri,
    durationDays: row.duration_days,
    practitionerNameEn: row.practitioner_name_en,
    practitionerNameAr: row.practitioner_name_ar,
    positionEn: row.position_en,
    positionAr: row.position_ar,
    hospitalNameEn: row.hospital_name_en,
    hospitalNameAr: row.hospital_name_ar,
    createdAt: row.created_at,
  };
}

function mapToDb(report: SickLeaveReport): DbRow {
  return {
    id: report.id,
    leave_id: report.leaveId,
    name_en: report.nameEn,
    name_ar: report.nameAr,
    national_id: report.nationalId,
    nationality_en: report.nationalityEn,
    nationality_ar: report.nationalityAr,
    employer_en: report.employerEn,
    employer_ar: report.employerAr,
    admission_date: report.admissionDate,
    discharge_date: report.dischargeDate,
    issue_date: report.issueDate,
    admission_date_hijri: report.admissionDateHijri,
    discharge_date_hijri: report.dischargeDateHijri,
    duration_days: report.durationDays,
    practitioner_name_en: report.practitionerNameEn,
    practitioner_name_ar: report.practitionerNameAr,
    position_en: report.positionEn,
    position_ar: report.positionAr,
    hospital_name_en: report.hospitalNameEn,
    hospital_name_ar: report.hospitalNameAr,
    created_at: report.createdAt,
  };
}
