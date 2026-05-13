/**
 * Simple Gregorian to Hijri date converter using the Umm al-Qura calendar approximation.
 */
export function gregorianToHijri(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const gDate = new Date(year, month - 1, day);

  const formatter = new Intl.DateTimeFormat("en-SA-u-ca-islamic-umalqura", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const parts = formatter.formatToParts(gDate);
  const hDay = parts.find((p) => p.type === "day")?.value ?? "";
  const hMonth = parts.find((p) => p.type === "month")?.value ?? "";
  const hYear = parts.find((p) => p.type === "year")?.value ?? "";

  return `${hDay}-${hMonth}-${hYear}`;
}

export function generateLeaveId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 100000000)).padStart(8, "0");
  return `GSL${yy}${mm}${random}`;
}

export function formatDateDMY(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function formatFullDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${days[date.getDay()]}, ${day} ${months[date.getMonth()]} ${year}`;
}

export function calculateDuration(startDate: string, endDate: string): number {
  const [d1, m1, y1] = startDate.split("-").map(Number);
  const [d2, m2, y2] = endDate.split("-").map(Number);
  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);
  const diff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}
