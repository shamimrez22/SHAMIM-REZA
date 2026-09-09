import { PersonalInfo, StatItem, SkillItem, ExperienceItem, EducationItem, CertificationItem, JobDescriptionData } from '../types/portfolio';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Generates an executive-formatted Word document (.doc) from structured CV data.
 * Opens seamlessly in Microsoft Word and Google Docs with clean typography and layout.
 */
export const downloadCVAsWordDoc = (
  info: PersonalInfo,
  stats: StatItem[],
  skills: SkillItem[],
  experiences: ExperienceItem[],
  educations: EducationItem[],
  certifications: CertificationItem[]
) => {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${info.name} - Curriculum Vitae</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          color: #1a202c;
          line-height: 1.5;
          margin: 40px;
        }
        .header {
          border-bottom: 2px solid #2b6cb0;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 24pt;
          color: #2b6cb0;
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }
        .title {
          font-size: 13pt;
          font-weight: bold;
          color: #4a5568;
          margin: 0 0 8px 0;
        }
        .contact {
          font-size: 10pt;
          color: #4a5568;
        }
        h2 {
          font-size: 13pt;
          color: #2b6cb0;
          border-bottom: 1px solid #cbd5e0;
          padding-bottom: 4px;
          margin-top: 18px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        p {
          font-size: 10.5pt;
          margin: 4px 0;
        }
        ul {
          margin: 4px 0 12px 20px;
          padding: 0;
        }
        li {
          font-size: 10pt;
          margin-bottom: 4px;
        }
        .job-header {
          font-weight: bold;
          font-size: 11pt;
        }
        .job-meta {
          font-size: 9.5pt;
          color: #718096;
          margin-bottom: 4px;
        }
        .badge-table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
        }
        .badge-table td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          background-color: #f7fafc;
          font-size: 9.5pt;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${info.name}</h1>
        <div class="title">${info.title}</div>
        <div class="contact">
          Email: ${info.email} | Phone: ${info.phone} | WhatsApp: ${info.whatsapp}<br/>
          Location: ${info.location} | LinkedIn: ${info.linkedin}
        </div>
      </div>

      <h2>Professional Summary</h2>
      <p>${info.intro}</p>

      <h2>Garments IE &amp; Performance Benchmarks</h2>
      <table class="badge-table">
        <tr>
          ${stats
            .map(
              (s) => `
            <td>
              <strong>${s.label}:</strong> ${s.value}${s.suffix}<br/>
              <span style="font-size: 8.5pt; color: #718096;">${s.description}</span>
            </td>
          `
            )
            .join('')}
        </tr>
      </table>

      <h2>Core Competencies &amp; Technical Skills</h2>
      <ul>
        ${skills.map((sk) => `<li><strong>${sk.name}</strong> (${sk.proficiency}%) - ${sk.description}</li>`).join('')}
      </ul>

      <h2>Professional Experience</h2>
      ${experiences
        .map(
          (e) => `
        <div style="margin-bottom: 14px;">
          <div class="job-header">${e.title} - ${e.company}</div>
          <div class="job-meta">Period: ${e.period} | Location: ${e.location}</div>
          <ul>
            ${e.responsibilities.map((r) => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}

      <h2>Education &amp; Academic Qualifications</h2>
      <ul>
        ${educations.map((ed) => `<li><strong>${ed.degree}</strong> - ${ed.institution} (${ed.period})<br/><span style="color: #4a5568;">${ed.details}</span></li>`).join('')}
      </ul>

      <h2>Certifications &amp; Professional Training</h2>
      <ul>
        ${certifications.map((c) => `<li><strong>${c.name}</strong> - ${c.issuer} (${c.year})</li>`).join('')}
      </ul>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${info.name.replace(/\s+/g, '_')}_Curriculum_Vitae.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates a world-class, executive Job Description Word document (.doc)
 * with unified table headers, preventing orphan headers and broken layouts in MS Word / Google Docs.
 */
export const downloadJobDescriptionAsWordDoc = (
  jd: JobDescriptionData,
  employeeName: string = 'Md. Shamim Reza'
) => {
  const totalMinutes = jd.totalDailyMinutes || 530;
  const totalHours = (totalMinutes / 60).toFixed(1);

  const responsibilitiesRows =
    jd.responsibilities && jd.responsibilities.length > 0
      ? jd.responsibilities
          .map(
            (r, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="border: 1pt solid #cbd5e1; padding: 6pt 8pt; text-align: center; font-weight: bold; color: #0f2942; font-size: 9.5pt;">${r.sl}</td>
          <td style="border: 1pt solid #cbd5e1; padding: 6pt 10pt; text-align: left; color: #1e293b; font-size: 9.5pt; line-height: 1.45;">${r.text}</td>
        </tr>
      `
          )
          .join('')
      : '';

  const dailyTasksRows =
    jd.dailyTasks && jd.dailyTasks.length > 0
      ? jd.dailyTasks
          .map(
            (t, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="border: 1pt solid #cbd5e1; padding: 5pt 6pt; text-align: center; font-weight: bold; color: #0f2942; font-size: 9pt;">${t.sl}</td>
          <td style="border: 1pt solid #cbd5e1; padding: 5pt 8pt; text-align: left; color: #0f172a; font-weight: 600; font-size: 9pt; line-height: 1.35;">${t.taskDescription}</td>
          <td style="border: 1pt solid #cbd5e1; padding: 5pt 6pt; text-align: center; font-weight: bold; color: #334155; font-size: 9pt;">${t.repeatPerDay}</td>
          <td style="border: 1pt solid #cbd5e1; padding: 5pt 6pt; text-align: center; color: #475569; font-family: 'Consolas', 'Courier New', monospace; font-size: 9pt;">${t.takenTime}</td>
          <td style="border: 1pt solid #cbd5e1; padding: 5pt 6pt; text-align: center; font-weight: bold; color: #0f2942; font-family: 'Consolas', 'Courier New', monospace; font-size: 9pt;">${t.totalTime}</td>
        </tr>
      `
          )
          .join('')
      : '';

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${jd.jobTitle} - Executive Job Description &amp; Daily Time-Study Audit</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 595.35pt 841.95pt; /* Standard A4 */
          margin: 30.0pt 32.0pt 30.0pt 32.0pt;
          mso-header-margin: 18.0pt;
          mso-footer-margin: 18.0pt;
          mso-paper-source: 0;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: 'Segoe UI', Calibri, Arial, sans-serif;
          color: #0f172a;
          line-height: 1.35;
          margin: 0;
          padding: 0;
          background-color: #ffffff;
        }
        table {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10pt;
          margin-bottom: 14pt;
        }
        .table-title-th {
          background-color: #0f2942;
          color: #ffffff;
          font-size: 10.5pt;
          font-weight: bold;
          text-align: left;
          padding: 7pt 10pt;
          border: 1.5pt solid #0f2942;
          letter-spacing: 0.5pt;
          text-transform: uppercase;
        }
        .col-th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-size: 8.5pt;
          font-weight: bold;
          border: 1pt solid #cbd5e1;
          padding: 5pt 6pt;
          text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- TOP EXECUTIVE LETTERHEAD -->
        <table style="width: 100%; border-bottom: 2.5pt solid #0f2942; padding-bottom: 6pt; margin-bottom: 10pt;">
          <tr>
            <td style="vertical-align: middle;">
              <div style="font-size: 8pt; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 1.5pt;">
                GARMENTS INDUSTRIAL ENGINEERING &amp; PRODUCTION ERP AUDIT
              </div>
              <div style="font-size: 15pt; font-weight: 900; color: #0f2942; text-transform: uppercase; margin-top: 2pt;">
                ${jd.jobTitle}
              </div>
              <div style="font-size: 9pt; font-weight: bold; color: #475569; margin-top: 1pt;">
                OFFICIAL FACTORY JOB DESCRIPTION &amp; DAILY TIME-STUDY LOG
              </div>
            </td>
            <td style="vertical-align: middle; text-align: right; width: 175pt;">
              <div style="background-color: #f8fafc; border: 1pt solid #cbd5e1; border-radius: 4pt; padding: 5pt 8pt; text-align: left; font-size: 8pt; color: #334155; line-height: 1.35;">
                <div><strong>NAME:</strong> ${employeeName}</div>
                <div><strong>DOC ID:</strong> IE/RMG/JD-${new Date().getFullYear()}</div>
                <div><strong>SHIFT STUDY:</strong> ${totalMinutes} MIN (~${totalHours} HRS)</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- METADATA INFORMATION GRID -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10pt; font-size: 8.5pt; background-color: #f8fafc;">
          <tr>
            <td style="border: 1pt solid #cbd5e1; padding: 5pt 8pt; width: 50%;">
              <span style="color: #64748b; font-size: 7.5pt; text-transform: uppercase; font-weight: bold; display: block;">Department</span>
              <strong style="color: #0f2942;">${jd.department}</strong>
            </td>
            <td style="border: 1pt solid #cbd5e1; padding: 5pt 8pt; width: 50%;">
              <span style="color: #64748b; font-size: 7.5pt; text-transform: uppercase; font-weight: bold; display: block;">Industry Sector</span>
              <strong style="color: #0f2942;">${jd.industry}</strong>
            </td>
          </tr>
          <tr>
            <td style="border: 1pt solid #cbd5e1; padding: 5pt 8pt;">
              <span style="color: #64748b; font-size: 7.5pt; text-transform: uppercase; font-weight: bold; display: block;">Reporting Authority</span>
              <strong style="color: #0f2942;">${jd.reportingTo}</strong>
            </td>
            <td style="border: 1pt solid #cbd5e1; padding: 5pt 8pt;">
              <span style="color: #64748b; font-size: 7.5pt; text-transform: uppercase; font-weight: bold; display: block;">Shift Standard Time Study</span>
              <strong style="color: #0f2942;">${totalMinutes} Minutes (~${totalHours} Hours / Daily Shift)</strong>
            </td>
          </tr>
        </table>

        <!-- TABLE 1: JOB RESPONSIBILITIES (UNIFIED HEADER - PREVENTS ORPHANING) -->
        <table class="report-table" style="page-break-inside: avoid;">
          <thead>
            <tr>
              <th colspan="2" class="table-title-th" style="background-color: #0f2942; color: #ffffff; font-size: 10pt; font-weight: bold; text-align: left; padding: 6pt 10pt; border: 1.5pt solid #0f2942;">
                1. JOB RESPONSIBILITIES &amp; CORE ACCOUNTABILITIES (মূল দায়িত্ব ও কর্মপরিধি)
              </th>
            </tr>
            <tr>
              <th class="col-th" style="width: 40pt; text-align: center;">SL#</th>
              <th class="col-th" style="text-align: left; padding-left: 10pt;">RESPONSIBILITY STATEMENT</th>
            </tr>
          </thead>
          <tbody>
            ${responsibilitiesRows}
          </tbody>
        </table>

        <!-- TABLE 2: JOB DESCRIPTION DAILY TASK TIME STUDY (UNIFIED HEADER) -->
        <table class="report-table" style="page-break-inside: auto;">
          <thead>
            <tr>
              <th colspan="5" class="table-title-th" style="background-color: #0f2942; color: #ffffff; font-size: 10pt; font-weight: bold; text-align: left; padding: 6pt 10pt; border: 1.5pt solid #0f2942;">
                2. JOB DESCRIPTION: DAILY TASK BREAKDOWN &amp; TIME-STUDY LOG (১৪টি নিয়মিত দৈনিক কাজ)
              </th>
            </tr>
            <tr>
              <th class="col-th" style="width: 32pt; text-align: center;">SL#</th>
              <th class="col-th" style="text-align: left; padding-left: 8pt;">CORE TASK DESCRIPTION</th>
              <th class="col-th" style="width: 80pt; text-align: center;">REPEAT / DAY</th>
              <th class="col-th" style="width: 75pt; text-align: center;">TASK TIME</th>
              <th class="col-th" style="width: 80pt; text-align: center;">TOTAL TIME</th>
            </tr>
          </thead>
          <tbody>
            ${dailyTasksRows}
            <tr style="background-color: #fef3c7; font-weight: bold;">
              <td colspan="4" style="border: 1.5pt solid #b45309; padding: 6pt 10pt; text-align: right; font-size: 9pt; color: #78350f; text-transform: uppercase;">
                TOTAL DAILY SHIFT TASK WORK TIME (মোট দৈনিক কর্মসময়):
              </td>
              <td style="border: 1.5pt solid #b45309; padding: 6pt; text-align: center; font-size: 10pt; font-weight: bold; color: #92400e; font-family: 'Consolas', monospace;">
                ${totalMinutes} MIN (~${totalHours} HRS)
              </td>
            </tr>
          </tbody>
        </table>

        <!-- SUMMARY OBJECTIVE & SCOPE -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10pt; margin-bottom: 12pt; background-color: #f8fafc; border: 1pt solid #cbd5e1; page-break-inside: avoid;">
          <tr>
            <td style="padding: 8pt 10pt;">
              <div style="font-size: 9pt; font-weight: bold; color: #0f2942; text-transform: uppercase; margin-bottom: 3pt;">
                Role Purpose &amp; Operational Objective
              </div>
              <div style="font-size: 8.5pt; color: #334155; line-height: 1.45; text-align: justify;">
                ${jd.rolePurpose}
              </div>
            </td>
          </tr>
        </table>

        <!-- SIGNATURES BLOCK (PAGE-BREAK AVOID - STAYS TOGETHER) -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20pt; page-break-inside: avoid; border-top: 1.5pt solid #cbd5e1; padding-top: 12pt;">
          <tr>
            <td style="width: 33.3%; text-align: center; vertical-align: top; padding: 8pt 6pt;">
              <div style="border-bottom: 1pt solid #475569; width: 130pt; margin: 0 auto 5pt auto; height: 26pt;"></div>
              <div style="font-size: 8.5pt; font-weight: bold; color: #0f2942; text-transform: uppercase;">PREPARED BY</div>
              <div style="font-size: 8pt; color: #475569;">${employeeName}</div>
              <div style="font-size: 7pt; color: #64748b;">IE &amp; Production ERP Executive</div>
            </td>
            <td style="width: 33.3%; text-align: center; vertical-align: top; padding: 8pt 6pt;">
              <div style="border-bottom: 1pt solid #475569; width: 130pt; margin: 0 auto 5pt auto; height: 26pt;"></div>
              <div style="font-size: 8.5pt; font-weight: bold; color: #0f2942; text-transform: uppercase;">VERIFIED BY</div>
              <div style="font-size: 8pt; color: #475569;">IE Manager / Lead</div>
              <div style="font-size: 7pt; color: #64748b;">Industrial Engineering Dept.</div>
            </td>
            <td style="width: 33.3%; text-align: center; vertical-align: top; padding: 8pt 6pt;">
              <div style="border-bottom: 1pt solid #475569; width: 130pt; margin: 0 auto 5pt auto; height: 26pt;"></div>
              <div style="font-size: 8.5pt; font-weight: bold; color: #0f2942; text-transform: uppercase;">APPROVED BY</div>
              <div style="font-size: 8pt; color: #475569;">AGM / GM - Operations</div>
              <div style="font-size: 7pt; color: #64748b;">Factory Executive Management</div>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${employeeName.replace(/\s+/g, '_')}_IE_Job_Description_Time_Study.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Downloads a professionally formatted Excel spreadsheet (.xls) with exact formatting,
 * borders, colors, and clean structure for Microsoft Excel and Google Sheets.
 */
export const downloadJobDescriptionAsExcelFile = (
  jd: JobDescriptionData,
  employeeName: string = 'Md. Shamim Reza'
) => {
  const totalMinutes = jd.totalDailyMinutes || 530;
  const totalHours = (totalMinutes / 60).toFixed(1);

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>IE Job Description &amp; Study</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Calibri, Arial, sans-serif; }
        .title-main { font-size: 16pt; font-weight: bold; color: #0f2942; }
        .sub-header { font-size: 11pt; font-weight: bold; color: #b45309; }
        .tbl-header { background-color: #0f2942; color: #ffffff; font-weight: bold; font-size: 11pt; }
        .col-hdr { background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; text-align: center; }
        .cell-data { border: 1px solid #000000; font-size: 10pt; }
        .total-row { background-color: #fef3c7; color: #92400e; font-weight: bold; border: 1px solid #000000; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="5" class="title-main">${jd.jobTitle}</td>
        </tr>
        <tr>
          <td colspan="5" class="sub-header">OFFICIAL FACTORY JOB DESCRIPTION &amp; DAILY TIME-STUDY LOG</td>
        </tr>
        <tr>
          <td colspan="2"><strong>Employee:</strong> ${employeeName}</td>
          <td colspan="3"><strong>Shift Standard Time:</strong> ${totalMinutes} MIN (~${totalHours} Hours)</td>
        </tr>
        <tr>
          <td colspan="2"><strong>Department:</strong> ${jd.department}</td>
          <td colspan="3"><strong>Reporting To:</strong> ${jd.reportingTo}</td>
        </tr>
        <tr><td></td></tr>

        <!-- TABLE 1: JOB RESPONSIBILITIES -->
        <tr>
          <td colspan="5" style="background-color: #fffef0; color: #b45309; font-weight: bold; font-size: 12pt; border: 1px solid #000000; text-align: center;">
            JOB RESPONSIBILITIES:
          </td>
        </tr>
        <tr>
          <th style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; width: 60px; text-align: center;">SL#</th>
          <th colspan="4" style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; text-align: left;">RESPONSIBILITY STATEMENT</th>
        </tr>
        ${jd.responsibilities?.map((r) => `
          <tr>
            <td style="border: 1px solid #000000; text-align: center; font-weight: bold;">${r.sl}</td>
            <td colspan="4" style="border: 1px solid #000000; text-align: left;">${r.text}</td>
          </tr>
        `).join('')}
        <tr><td></td></tr>

        <!-- TABLE 2: JOB DESCRIPTION DAILY TASKS -->
        <tr>
          <td colspan="5" style="background-color: #fffef0; color: #b45309; font-weight: bold; font-size: 12pt; border: 1px solid #000000; text-align: center;">
            JOB DESCRIPTION:
          </td>
        </tr>
        <tr>
          <th style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; width: 50px; text-align: center;">SL#</th>
          <th style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; text-align: left; width: 350px;">TASK DESCRIPTION</th>
          <th style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; width: 130px; text-align: center;">TASK REPEAT / DAY</th>
          <th style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; width: 120px; text-align: center;">TASK TAKEN TIME</th>
          <th style="background-color: #fef9c3; color: #92400e; font-weight: bold; border: 1px solid #000000; width: 120px; text-align: center;">TOTAL TASK TIME</th>
        </tr>
        ${jd.dailyTasks?.map((t) => `
          <tr>
            <td style="border: 1px solid #000000; text-align: center; font-weight: bold;">${t.sl}</td>
            <td style="border: 1px solid #000000; text-align: left;">${t.taskDescription}</td>
            <td style="border: 1px solid #000000; text-align: center; font-weight: bold;">${t.repeatPerDay}</td>
            <td style="border: 1px solid #000000; text-align: center;">${t.takenTime}</td>
            <td style="border: 1px solid #000000; text-align: center; font-weight: bold;">${t.totalTime}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="4" style="border: 1px solid #000000; text-align: right; padding: 6px 10px; font-weight: bold;">
            TOTAL DAILY SHIFT TASK WORK TIME:
          </td>
          <td style="border: 1px solid #000000; text-align: center; font-size: 11pt; color: #92400e; font-weight: bold;">
            ${totalMinutes} MIN
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + excelContent], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${employeeName.replace(/\s+/g, '_')}_IE_Job_Description_Time_Study.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Direct PDF Download: Captures an on-screen DOM element (Executive Report, CV, or Spreadsheet)
 * using html2canvas-pro (with full support for Tailwind CSS v4 OKLCH colors)
 * and compiles it into a high-resolution, vector-accurate A4 PDF using jsPDF.
 * If canvas capturing encounters any restriction or error, seamlessly falls back to direct vector PDF generation.
 */
export const downloadElementAsDirectPDF = async (
  elementId: string,
  fileName: string,
  onProgress?: (isGenerating: boolean) => void,
  fallbackFn?: () => void
): Promise<void> => {
  try {
    if (onProgress) onProgress(true);
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      if (fallbackFn) {
        fallbackFn();
        return;
      }
      throw new Error(`Element with id "${elementId}" not found for PDF generation.`);
    }

    // Capture using html2canvas-pro with OKLCH support
    const canvas = await html2canvas(targetElement, {
      scale: 2, // High resolution (retina 2x)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(targetElement.scrollWidth, 1080),
      onclone: (clonedDoc) => {
        // Hide interactive buttons and print:hidden elements in the cloned document
        const printHiddenElements = clonedDoc.querySelectorAll('.print\\:hidden, button');
        printHiddenElements.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210; // A4 mm
    const pageHeight = 297; // A4 mm
    const margin = 6; // 6mm margin
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;
    let page = 1;

    // Render first page
    pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
    heightLeft -= (pageHeight - margin * 2);

    // Multi-page loop if document height exceeds single A4 page
    while (heightLeft > 0) {
      page += 1;
      pdf.addPage();
      position = margin - (page - 1) * (pageHeight - margin * 2);
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
      heightLeft -= (pageHeight - margin * 2);
    }

    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeFileName);
  } catch (error) {
    console.error('Error generating direct visual PDF, executing fallback:', error);
    if (fallbackFn) {
      fallbackFn();
    } else {
      // Create a clean standalone emergency vector PDF
      const fallbackPdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      fallbackPdf.setFont('helvetica', 'bold');
      fallbackPdf.setFontSize(16);
      fallbackPdf.text(fileName.replace(/_/g, ' ').replace('.pdf', ''), 14, 20);
      fallbackPdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    }
  } finally {
    if (onProgress) onProgress(false);
  }
};

/**
 * Direct Vector PDF generator for Curriculum Vitae (CV).
 * Runs 100% natively in browser without DOM canvas dependencies, guaranteeing instant PDF download!
 */
export const downloadCVAsDirectPDF = (
  info: PersonalInfo,
  stats: StatItem[],
  skills: SkillItem[],
  experiences: ExperienceItem[],
  educations: EducationItem[],
  certifications: CertificationItem[],
  templateName: string = 'Modern_Executive'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const maxContentWidth = pageWidth - margin * 2;
  let y = 14;

  const checkPage = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - 16) {
      doc.addPage();
      y = 14;
    }
  };

  // Header Banner
  doc.setFillColor(15, 41, 66); // Deep Navy (#0f2942)
  doc.rect(margin, y, maxContentWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text((info.name || 'MD. SHAMIM REZA').toUpperCase(), margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 230, 242);
  doc.text(info.title || 'Executive, Industrial Engineering (Garments Manufacturing)', margin + 6, y + 16);

  const contactLine = `Phone: ${info.phone || '+8801736965824'} | Email: ${info.email || 'shamimrez22@gmail.com'} | WhatsApp: ${info.whatsapp || '+8801736965824'}`;
  doc.setFontSize(8);
  doc.setTextColor(200, 215, 230);
  doc.text(contactLine, margin + 6, y + 22);

  y += 32;

  // Professional Summary
  doc.setFillColor(243, 246, 250);
  doc.rect(margin, y, maxContentWidth, 6, 'F');
  doc.setTextColor(15, 41, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('CAREER OBJECTIVE & PROFESSIONAL SUMMARY', margin + 3, y + 4.5);
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 50, 60);
  const introLines = doc.splitTextToSize(
    info.intro ||
      'Dedicated Garments Industrial Engineering (IE) professional with 4+ years of hands-on experience in sewing line layout, SMV calculation, Daily Production Reports (DPR), efficiency tracking, and work study analysis.',
    maxContentWidth
  );
  doc.text(introLines, margin, y);
  y += introLines.length * 4.2 + 4;

  // Key Benchmarks
  if (stats && stats.length > 0) {
    checkPage(20);
    doc.setFillColor(243, 246, 250);
    doc.rect(margin, y, maxContentWidth, 6, 'F');
    doc.setTextColor(15, 41, 66);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('CORE IE BENCHMARKS & PERFORMANCE METRICS', margin + 3, y + 4.5);
    y += 9;

    const colWidth = maxContentWidth / Math.min(stats.length, 4);
    stats.slice(0, 4).forEach((st, idx) => {
      const colX = margin + idx * colWidth;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(220, 228, 238);
      doc.rect(colX, y, colWidth - 2, 13, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 41, 66);
      doc.text(`${st.value}${st.suffix || ''}`, colX + 3, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(80, 90, 100);
      doc.text(st.label, colX + 3, y + 10);
    });
    y += 17;
  }

  // Professional Experience
  if (experiences && experiences.length > 0) {
    checkPage(25);
    doc.setFillColor(15, 41, 66);
    doc.rect(margin, y, maxContentWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('PROFESSIONAL WORK EXPERIENCE', margin + 3, y + 4.5);
    y += 9;

    experiences.forEach((exp) => {
      checkPage(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 41, 66);
      doc.text(`${exp.title} - ${exp.company}`, margin, y);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 110, 120);
      doc.text(`Duration: ${exp.period} | Location: ${exp.location}`, margin, y + 4);
      y += 7.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 50, 60);
      exp.responsibilities.slice(0, 4).forEach((resp) => {
        checkPage(7);
        const respLines = doc.splitTextToSize(`• ${resp}`, maxContentWidth - 4);
        doc.text(respLines, margin + 2, y);
        y += respLines.length * 3.6 + 1;
      });
      y += 3;
    });
  }

  // Key Skills & Tools
  if (skills && skills.length > 0) {
    checkPage(20);
    doc.setFillColor(243, 246, 250);
    doc.rect(margin, y, maxContentWidth, 6, 'F');
    doc.setTextColor(15, 41, 66);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('KEY TECHNICAL SKILLS & SOFTWARE', margin + 3, y + 4.5);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 50, 60);
    const skillList = skills.map((s) => `${s.name} (${s.proficiency}%)`).join('  •  ');
    const skillLines = doc.splitTextToSize(skillList, maxContentWidth);
    doc.text(skillLines, margin, y);
    y += skillLines.length * 4 + 4;
  }

  // Education
  if (educations && educations.length > 0) {
    checkPage(18);
    doc.setFillColor(243, 246, 250);
    doc.rect(margin, y, maxContentWidth, 6, 'F');
    doc.setTextColor(15, 41, 66);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('EDUCATION & QUALIFICATIONS', margin + 3, y + 4.5);
    y += 9;

    educations.forEach((edu) => {
      checkPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 41, 66);
      doc.text(`${edu.degree} - ${edu.institution} (${edu.period})`, margin, y);
      y += 4;
      if (edu.details) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(80, 90, 100);
        doc.text(edu.details, margin, y);
        y += 4.5;
      }
    });
  }

  // Page Numbers & Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(210, 220, 230);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 140, 150);
    doc.text(
      `${info.name || 'Shamim Reza'} - Curriculum Vitae (${templateName})`,
      margin,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 6);
  }

  const fileName = `${(info.name || 'Shamim_Reza').replace(/\s+/g, '_')}_Curriculum_Vitae_${templateName}.pdf`;
  doc.save(fileName);
};

/**
 * Direct Vector PDF generator for Garments IE Job Description (JD).
 * Runs 100% natively in browser without DOM canvas dependencies, guaranteeing instant PDF download!
 */
export const downloadJobDescriptionAsDirectPDF = (
  jd: JobDescriptionData,
  employeeName: string = 'Md. Shamim Reza',
  formatName: string = 'Executive_Report'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const maxContentWidth = pageWidth - margin * 2;
  let y = 14;

  const checkPage = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - 16) {
      doc.addPage();
      y = 14;
    }
  };

  // Header Banner
  doc.setFillColor(15, 41, 66); // Deep Navy (#0f2942)
  doc.rect(margin, y, maxContentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('JOB DESCRIPTION & OPERATIONAL SOP', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 230, 242);
  doc.text(`Role: ${jd.jobTitle || 'Executive, Industrial Engineering'} | Dept: ${jd.department || 'Industrial Engineering (IE)'}`, margin + 6, y + 14);
  doc.text(`Employee: ${employeeName} | Reporting To: ${jd.reportingTo || 'IE Manager / AGM (Production)'}`, margin + 6, y + 19);

  y += 30;

  // Metadata Grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(210, 220, 230);
  doc.rect(margin, y, maxContentWidth, 14, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 41, 66);
  doc.text('Industry:', margin + 4, y + 4.5);
  doc.text('Experience:', margin + 50, y + 4.5);
  doc.text('Work Hours:', margin + 95, y + 4.5);
  doc.text('Shift Time:', margin + 140, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 70, 80);
  doc.text(jd.industry || 'RMG & Garments', margin + 4, y + 9.5);
  doc.text(jd.experienceRequired || '4+ Years', margin + 50, y + 9.5);
  doc.text(`${(jd.totalDailyMinutes || 530) / 60} Hours/Day`, margin + 95, y + 9.5);
  doc.text('08:00 AM - 06:00 PM', margin + 140, y + 9.5);

  y += 20;

  // Role Purpose
  doc.setFillColor(243, 246, 250);
  doc.rect(margin, y, maxContentWidth, 6, 'F');
  doc.setTextColor(15, 41, 66);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('ROLE PURPOSE & OPERATIONAL SCOPE', margin + 3, y + 4.5);
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 50, 60);
  const purposeLines = doc.splitTextToSize(
    jd.rolePurpose ||
      'Lead and monitor factory industrial engineering operations, ensure target line efficiency, establish accurate standard minutes values (SMV), prepare daily production reports (DPR), and minimize non-productive time (NPT).',
    maxContentWidth
  );
  doc.text(purposeLines, margin, y);
  y += purposeLines.length * 4.2 + 4;

  // Daily Shift Tasks
  if (jd.dailyTasks && jd.dailyTasks.length > 0) {
    checkPage(30);
    doc.setFillColor(15, 41, 66);
    doc.rect(margin, y, maxContentWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SHIFT TASK BREAKDOWN & TIME STUDY (DAILY WORK SCHEDULE)', margin + 3, y + 4.5);
    y += 8;

    // Table Header
    doc.setFillColor(235, 240, 248);
    doc.setDrawColor(200, 210, 225);
    doc.rect(margin, y, maxContentWidth, 5.5, 'FD');
    doc.setTextColor(15, 41, 66);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('SL#', margin + 2, y + 3.8);
    doc.text('Task Description', margin + 12, y + 3.8);
    doc.text('Freq/Day', margin + 115, y + 3.8);
    doc.text('Duration', margin + 140, y + 3.8);
    doc.text('Total Min', margin + 165, y + 3.8);
    y += 5.5;

    jd.dailyTasks.forEach((t, i) => {
      checkPage(8);
      doc.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
      doc.setDrawColor(225, 230, 238);
      doc.rect(margin, y, maxContentWidth, 5.5, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 50, 60);
      doc.text(String(t.sl), margin + 2, y + 3.8);

      const taskName = doc.splitTextToSize(t.taskDescription, 100)[0] || t.taskDescription;
      doc.text(taskName, margin + 12, y + 3.8);
      doc.text(String(t.repeatPerDay), margin + 118, y + 3.8);
      doc.text(String(t.takenTime), margin + 140, y + 3.8);
      doc.text(String(t.totalTime), margin + 168, y + 3.8);
      y += 5.5;
    });

    // Total Row
    checkPage(8);
    doc.setFillColor(254, 243, 199); // Amber light
    doc.setDrawColor(217, 119, 6);
    doc.rect(margin, y, maxContentWidth, 6.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    doc.text('TOTAL DAILY SHIFT WORK TIME:', margin + 45, y + 4.2);
    doc.text(`${jd.totalDailyMinutes || 530} MINUTES (${((jd.totalDailyMinutes || 530) / 60).toFixed(1)} HOURS)`, margin + 125, y + 4.2);
    y += 10;
  }

  // Key Performance Indicators (KPIs)
  if (jd.kpis && jd.kpis.length > 0) {
    checkPage(24);
    doc.setFillColor(243, 246, 250);
    doc.rect(margin, y, maxContentWidth, 6, 'F');
    doc.setTextColor(15, 41, 66);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('KEY PERFORMANCE INDICATORS (KPIS) & BENCHMARKS', margin + 3, y + 4.5);
    y += 8;

    jd.kpis.forEach((k) => {
      checkPage(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 41, 66);
      doc.text(`• ${k.title} [Target: ${k.target}]`, margin + 2, y + 3.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 80, 90);
      doc.text(`- ${k.desc}`, margin + 85, y + 3.5);
      y += 5.5;
    });
    y += 4;
  }

  // Signatures Section
  checkPage(24);
  y += 6;
  doc.setDrawColor(180, 190, 205);
  const sigColWidth = maxContentWidth / 3;

  // Sig 1
  doc.line(margin + 5, y + 8, margin + sigColWidth - 5, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 41, 66);
  doc.text('Prepared By:', margin + 5, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${employeeName} (Executive, IE)`, margin + 5, y + 16);

  // Sig 2
  doc.line(margin + sigColWidth + 5, y + 8, margin + sigColWidth * 2 - 5, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.text('Verified By:', margin + sigColWidth + 5, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('IE Manager / Head of Dept.', margin + sigColWidth + 5, y + 16);

  // Sig 3
  doc.line(margin + sigColWidth * 2 + 5, y + 8, margin + maxContentWidth - 5, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.text('Approved By:', margin + sigColWidth * 2 + 5, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('General Manager / Factory Director', margin + sigColWidth * 2 + 5, y + 16);

  // Page numbering on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(210, 220, 230);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 140, 150);
    doc.text(`Official Job Description & SOP - ${employeeName}`, margin, pageHeight - 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 6);
  }

  const fileName = `${employeeName.replace(/\s+/g, '_')}_IE_Job_Description_${formatName}.pdf`;
  doc.save(fileName);
};


