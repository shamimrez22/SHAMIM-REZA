import { PersonalInfo, StatItem, SkillItem, ExperienceItem, EducationItem, CertificationItem, JobDescriptionData } from '../types/portfolio';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
