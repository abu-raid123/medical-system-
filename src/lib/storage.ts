import fs from "fs";
import path from "path";
import type { SickLeaveReport } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reports.json");

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

export function getAllReports(): SickLeaveReport[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as SickLeaveReport[];
}

export function getReportById(id: string): SickLeaveReport | undefined {
  const reports = getAllReports();
  return reports.find((r) => r.id === id);
}

export function getReportByLeaveId(
  leaveId: string
): SickLeaveReport | undefined {
  const reports = getAllReports();
  return reports.find((r) => r.leaveId === leaveId);
}

export function saveReport(report: SickLeaveReport): void {
  ensureDataFile();
  const reports = getAllReports();
  reports.push(report);
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), "utf-8");
}
