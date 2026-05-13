---
name: testing-sick-leave-system
description: Test the bilingual sick leave report system end-to-end. Use when verifying form input, PDF generation, QR codes, inquiry lookup, or Hijri date conversion.
---

# Testing the Sick Leave Report System

## Prerequisites

- Node.js installed
- Run `npm install` in the project root
- No external services or secrets needed — fully local app with JSON file storage

## Starting the Dev Server

```bash
cd /home/ubuntu/medical-system-
npm run dev
```

Server runs on `http://localhost:3000` (or next available port if 3000 is in use).

## Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Navigation hub with Create and Inquiry buttons |
| Create | `/create` | Bilingual input form (16 fields) |
| Report | `/report/[uuid]` | View generated report + download PDF |
| Inquiry | `/inquiry?leaveId=GSL...` | Lookup report by Leave ID |

## Testing Flow

### 1. Form Input (`/create`)

- Fill all 16 fields: name, national ID, nationality, employer (each in EN + AR), 3 dates, practitioner name/position (EN + AR), hospital name (EN + AR)
- **Arabic text input**: The computer-use tool may not reliably type Arabic characters. Use JavaScript console to set Arabic field values via React's native input setter:
  ```javascript
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeSetter.call(inputElement, 'Arabic text here');
  inputElement.dispatchEvent(new Event('input', { bubbles: true }));
  inputElement.dispatchEvent(new Event('change', { bubbles: true }));
  ```
- Verify duration auto-calculates from admission/discharge dates
- Verify Hijri dates appear below date inputs (format: DD-MM-YYYY هجري)

### 2. Form Submission

- Click "حفظ وإنشاء التقرير / Save & Generate Report"
- Button shows loading state "جاري الحفظ..."
- Should redirect to `/report/[uuid]`
- Leave ID format: `GSL` followed by digits (e.g., `GSL260582724937`)

### 3. Report Page (`/report/[id]`)

Verify:
- Seha logo, Kingdom text image, geometric background patterns
- Data table with all bilingual fields
- Duration bar (blue) with Gregorian and Hijri date ranges
- QR code image rendered (base64 data URI)
- MOH logo, NHIC logo in footer area
- Inquiry link panel with copy button
- Timestamp showing current date/time

### 4. PDF Download

- Click "تحميل PDF" button
- PDF generates via html2canvas + jsPDF (may take a few seconds)
- File downloads as `sick-leave-report-GSL[id].pdf`
- File size is typically large (~20-25 MB) due to canvas-based rendering

### 5. Inquiry Page (`/inquiry`)

- With `?leaveId=GSL...` query param: auto-loads and displays report data
- Manual search: type Leave ID and click "بحث / Search"
- Invalid ID shows bilingual error: "لم يتم العثور على التقرير" / "Report not found"
- Valid result shows full data table + "View Full Report & Download PDF" link

## Data Storage

Reports are stored in `data/reports.json` (file-based). You can inspect or clear this file to reset test state.

## Common Issues

- **Port conflict**: If port 3000 is busy, Next.js auto-selects next available port. Check terminal output.
- **Arabic text not typing**: Use the JavaScript console approach described above.
- **PDF size**: Large PDF files (~23 MB) are normal — html2canvas renders the DOM as high-resolution canvas images.
- **Images not loading in report**: Ensure `public/images/` contains all required assets (seha-logo.png, moh-logo.jpeg, nhic-logo.png, kingdom-text.png, geometric backgrounds).

## Devin Secrets Needed

None — this is a fully local application with no external API dependencies.
