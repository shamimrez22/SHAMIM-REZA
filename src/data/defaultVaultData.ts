import { VaultDocument } from '../types/portfolio';

/**
 * Default sample documents preloaded in the DATA vault.
 * Includes authentic Garments Industrial Engineering spreadsheets, Word formats, and PDF docs.
 */

// A simple valid base64 CSV spreadsheet that Excel opens cleanly
const sampleExcelContent = `Line Balancing & SMV Calculation Matrix - Garments IE
Style,Operation Name,Machine Type,SMV (Min),Target/Hr,Actual Output,Efficiency %
POLO-2026,Collar Attach,Overlock 4-Thread,0.45,133,125,93.9%
POLO-2026,Placket Make,Single Needle Lockstitch,0.65,92,88,95.6%
POLO-2026,Shoulder Join,Overlock 4-Thread,0.30,200,195,97.5%
POLO-2026,Sleeve Hemming,Flatlock Cylinder Bed,0.50,120,118,98.3%
POLO-2026,Bottom Hem,Flatlock,0.40,150,145,96.7%
TOTAL / AVERAGE,,,2.30,520,498,95.7%
`;

const sampleWordContent = `================================================================================
STANDARD OPERATING PROCEDURE (SOP) - GARMENTS INDUSTRIAL ENGINEERING
Document Reference: IE-SOP-2026-V1
Department: Production & Industrial Engineering
Prepared By: Shamim Reza (Executive - Garments IE & ERP Management)
================================================================================

1. PURPOSE & SCOPE
This document outlines standard method analysis, cycle timing protocols, and bottle-neck elimination across sewing assembly lines.

2. PRE-PRODUCTION SAMPLING & SMV BREAKDOWN
- Video analysis and 10-cycle stopwatch measurement
- Machine speed and stitch density verification (10-12 SPI)
- Operator rating (Westinghouse System)

3. LINE BALANCING & PITCH TIME TARGETING
- Target Output = (Total Manpower * Working Minutes * Target Efficiency) / Total SMV
- Hourly monitoring using digital production boards and ERP sync.

4. 5S & METHOD STUDY AUDIT
- Tool placement within maximum working area (30-40cm)
- Gravity feed chute implementation for reduced handling time.
`;

const samplePdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Title (Garments Industrial Engineering Technical Profile - Shamim Reza)
   /Creator (Shamim Reza Portfolio)
   /Producer (PDF Standard) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << >> >>
endobj
5 0 obj
<< /Length 120 >>
stream
BT
/F1 18 Tf
50 720 Td
(GARMENTS INDUSTRIAL ENGINEERING & ERP PROFILE) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000140 00000 n 
0000000195 00000 n 
0000000262 00000 n 
0000000363 00000 n 
trailer
<< /Size 6 /Root 2 0 R /Info 1 0 R >>
startxref
535
%%EOF`;

function toBase64DataUrl(content: string, mime: string): string {
  try {
    return `data:${mime};base64,${btoa(unescape(encodeURIComponent(content)))}`;
  } catch {
    return `data:${mime};charset=utf-8,${encodeURIComponent(content)}`;
  }
}

export const initialVaultDocuments: VaultDocument[] = [
  {
    id: 'vault_doc_1',
    title: 'Line Balancing & SMV Calculation Sheet (লাইভ ব্যালান্সিং শীট)',
    fileName: 'Line_Balancing_SMV_Calculation_Matrix.csv',
    fileType: 'excel',
    fileExtension: '.csv',
    fileSize: '3.2 KB',
    fileSizeBytes: 3276,
    mimeType: 'text/csv',
    fileData: toBase64DataUrl(sampleExcelContent, 'text/csv'),
    category: 'Garments IE & SMV',
    description: 'দৈনিক স্যুইং লাইনের অপারেশন ব্রেকডাউন, সাইকেল টাইম ও এফিসিয়েন্সি ক্যালকুলেশন ফরম্যাট।',
    uploadDate: '08 Sep 2026, 10:30 AM',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'vault_doc_2',
    title: 'Standard Operating Procedure (SOP) Manual (গার্মেন্টস এসওপি)',
    fileName: 'Garments_IE_Production_SOP_Manual.doc',
    fileType: 'word',
    fileExtension: '.doc',
    fileSize: '4.8 KB',
    fileSizeBytes: 4915,
    mimeType: 'application/msword',
    fileData: toBase64DataUrl(sampleWordContent, 'application/msword'),
    category: 'SOP & Protocols',
    description: 'গার্মেন্টস ম্যানুফ্যাকচারিং ফ্লোরে মেথড স্টাডি, মোশন স্টাডি ও স্ট্যান্ডার্ড কাজের নিয়মাবলী।',
    uploadDate: '07 Sep 2026, 04:15 PM',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'vault_doc_3',
    title: 'Garments IE Technical Competencies Document (টেকনিক্যাল সামারি)',
    fileName: 'Shamim_Reza_IE_Technical_Overview.pdf',
    fileType: 'pdf',
    fileExtension: '.pdf',
    fileSize: '2.5 KB',
    fileSizeBytes: 2560,
    mimeType: 'application/pdf',
    fileData: toBase64DataUrl(samplePdfContent, 'application/pdf'),
    category: 'Official Reports',
    description: 'ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং, ইআরপি ডাটা ম্যানেজমেন্ট ও প্রোডাকশন অডিট সামারি পেপার।',
    uploadDate: '06 Sep 2026, 11:20 AM',
    createdAt: Date.now() - 86400000 * 4,
  },
];
