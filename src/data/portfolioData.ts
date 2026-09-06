import {
  PersonalInfo,
  StatItem,
  SkillItem,
  ToolItem,
  ServiceItem,
  ProcessStep,
  WhyChooseItem,
  SampleProject,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  TestimonialItem,
} from '../types/portfolio';

/**
 * ============================================================================
 * CENTRAL CONFIGURATION DATA FILE
 * Configured specifically for:
 * GARMENTS SECTOR INDUSTRIAL ENGINEERING (IE) REPORT & DATA ENTRY EXECUTIVE
 * Tailored for real factory operations, interview readiness, and office skills.
 * ============================================================================
 */

export const defaultMasterTheme: 'orange' | 'dark' | 'light' = 'orange';

export const personalInfo: PersonalInfo = {
  name: 'Shamim Reza',
  title: 'GARMENTS IE REPORT, ERP & DATA ENTRY EXECUTIVE',
  headline: 'GARMENTS IE REPORT, ERP & DATA ENTRY EXECUTIVE',
  tagline: 'Precision IE Analytics. Garments ERP Operations. Flawless Industrial Reporting.',
  intro:
    'Dedicated Garments Industrial Engineering (IE) Report, ERP & Data Entry Executive with specialized expertise in Apparel Manufacturing Operations, Garments ERP Software Logging (Cutting, Sewing, Finishing & WIP), Line Balancing, Hourly Production Monitoring (HPR), SMV/SAM Breakdown, Operator Skill Matrix, High-Speed Typing (65+ WPM), Internet Research, and Professional Mailing.',
  aboutText:
    'I am a results-oriented Garments IE Report, ERP & Data Entry Executive with hands-on experience in apparel manufacturing environments. I specialize in compiling Daily Production Reports (DPR), managing factory ERP production modules (FastReact, SAP, custom Garments ERP), tracking Sewing & Finishing Line Efficiency, calculating SMV/SAM, monitoring Non-Productive Time (NPT), and analyzing hourly production variances. Beyond IE reporting and ERP operations, I bring exceptional computer literacy—including fast alphanumeric typing (65+ WPM), advanced Microsoft Excel modeling, internet research, buyer email communication, and end-to-end office data management.',
  location: 'Dhaka, Bangladesh (Available for Garments Industrial Hubs / On-site & Remote)',
  experienceYears: '3+ Years in Garments IE & Data Operations',
  availability: 'Available Immediately for Full-Time Employment',
  email: 'shamimrez22@gmail.com',
  phone: '+880 1700-000000',
  whatsapp: '+880 1700-000000',
  linkedin: 'linkedin.com/in/shamim-reza-ie',
  profilePhotoUrl: '/profile-photo.svg', // High-end executive portrait asset, loads on Vercel/Cloudflare across all devices
};

export const statistics: StatItem[] = [
  {
    id: 'stat-accuracy',
    value: 100,
    suffix: '%',
    label: 'IE REPORT ACCURACY',
    description: 'Zero-discrepancy verification on SMV, line output & efficiency formulas',
  },
  {
    id: 'stat-lines',
    value: 20,
    suffix: '+',
    label: 'LINES MONITORED',
    description: 'Active sewing, cutting, and finishing line streams tracked every hour',
  },
  {
    id: 'stat-typing',
    value: 65,
    suffix: '+ WPM',
    label: 'FAST TYPING SPEED',
    description: 'Bilingual alphanumeric entry speed with 99%+ real-time accuracy',
  },
  {
    id: 'stat-commitment',
    value: 100,
    suffix: '%',
    label: 'ON-TIME DPR MAILS',
    description: 'Morning & evening executive production reports dispatched promptly',
  },
];

export const skills: SkillItem[] = [
  {
    id: 'garments-ie-efficiency',
    name: 'Garments Line Efficiency (IE)',
    category: 'core',
    description: 'Calculating sewing line efficiency %, target vs. actual variance, pitch time, and labor productivity formulas.',
    proficiency: 100,
    iconName: 'Activity',
  },
  {
    id: 'smv-operation-breakdown',
    name: 'SMV & Operation Breakdown',
    category: 'core',
    description: 'Operation sequence mapping, machine allocation (SNLS, Overlock, Flatlock), cycle time, and SMV allocation sheets.',
    proficiency: 98,
    iconName: 'Clock',
  },
  {
    id: 'hourly-production-tracking',
    name: 'Hourly Production Reports (HPR)',
    category: 'core',
    description: 'Floor tally consolidation, WIP monitoring, bottleneck identification, and hourly target achievement analysis.',
    proficiency: 100,
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'loss-time-npt',
    name: 'Loss Time & NPT Tracking',
    category: 'core',
    description: 'Logging Non-Productive Time (NPT) including mechanical breakdowns, feeding delays, reworks, and line changeovers.',
    proficiency: 96,
    iconName: 'AlertCircle',
  },
  {
    id: 'operator-skill-matrix',
    name: 'Operator Skill Matrix & Capacity',
    category: 'core',
    description: 'Maintaining operator multi-skill grading (A/B/C), cycle times, machine handling, and capacity balancing data.',
    proficiency: 97,
    iconName: 'Users',
  },
  {
    id: 'fast-typing',
    name: 'Fast Alphanumeric Typing (65+ WPM)',
    category: 'operations',
    description: 'Rapid touch typing in English and Bangla with 99%+ accuracy and 10-key numeric precision for production chits.',
    proficiency: 99,
    iconName: 'Keyboard',
  },
  {
    id: 'microsoft-excel-ie',
    name: 'Microsoft Excel (Advanced IE)',
    category: 'software',
    description: 'XLOOKUP, VLOOKUP, SUMIFS, Pivot Tables, conditional formatting, data validation dropdowns, and automated efficiency formulas.',
    proficiency: 98,
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'executive-mailing',
    name: 'Executive Mailing & DPR Dispatch',
    category: 'operations',
    description: 'Dispatching Daily Production Reports (DPR), floor status updates, management briefs, and buyer correspondence via Outlook/Gmail.',
    proficiency: 98,
    iconName: 'Mail',
  },
  {
    id: 'internet-research-techpack',
    name: 'Internet Research & Tech-Packs',
    category: 'operations',
    description: 'Downloading buyer tech packs, trim & fabric specifications, machinery research, and international garment size charts.',
    proficiency: 96,
    iconName: 'Search',
  },
  {
    id: 'google-sheets-cloud',
    name: 'Google Sheets & Cloud Workspaces',
    category: 'software',
    description: 'Real-time multi-line shared production logs, IMPORTRANGE, automated summary views, and cloud team collaboration.',
    proficiency: 96,
    iconName: 'Table',
  },
  {
    id: 'garments-erp-data',
    name: 'Garments ERP & Production Module Operations',
    category: 'software',
    description: 'Expert production module entries in Garments ERP (FastReact, SAP, customized ERP), bundle card registration, cutting/sewing output logging, and real-time WIP updates.',
    proficiency: 98,
    iconName: 'Database',
  },
  {
    id: 'computer-operations',
    name: 'Computer Operations & System Care',
    category: 'operations',
    description: 'Windows OS navigation, file archiving, hardware/printer setup, antivirus, network shared folder management, and digital backups.',
    proficiency: 97,
    iconName: 'Cpu',
  },
  {
    id: 'microsoft-word-sop',
    name: 'Microsoft Word & IE Bulletins',
    category: 'software',
    description: 'IE Standard Operating Procedures (SOP), operation bulletins, machine layout charts, meeting circulars, and formal letters.',
    proficiency: 95,
    iconName: 'FileText',
  },
  {
    id: 'data-cleaning-reconciliation',
    name: 'Data Cleaning & Reconciliation',
    category: 'core',
    description: 'Cutting-to-shipping reconciliation, duplicate row removal, DHU defect calculation, and discrepancy elimination.',
    proficiency: 99,
    iconName: 'Sparkles',
  },
  {
    id: 'pdf-to-excel-conversion',
    name: 'PDF to Excel / Word Conversion',
    category: 'core',
    description: 'Precision OCR and table extraction from scanned buyer purchase orders, packing lists, and measurement tech packs.',
    proficiency: 98,
    iconName: 'FileCheck',
  },
];

export const tools: ToolItem[] = [
  {
    id: 'tool-excel',
    name: 'Microsoft Excel (IE Workbooks)',
    category: 'IE Analytics & Modeling',
    description: 'Primary platform for daily line efficiency formulas, target calculation, SMV models, and Pivot reporting.',
    level: 'Expert Level',
    iconName: 'FileSpreadsheet',
    features: ['Line Efficiency Formulas', 'Pivot Tables & Dynamic Charts', 'XLOOKUP & SUMIFS Cross-checks', 'Data Validation Dropdowns'],
  },
  {
    id: 'tool-typing',
    name: 'Fast Typing & 10-Key Numpad',
    category: 'Data Processing Speed',
    description: 'High-speed touch typing at 65+ WPM in English and Bangla (Bijoy/Avro) for fast floor chit entries.',
    level: 'Speed Certified (65+ WPM)',
    iconName: 'Keyboard',
    features: ['65+ Words Per Minute', '10-Key Numpad High Accuracy', 'English & Bangla Layouts', 'Zero Transposition Errors'],
  },
  {
    id: 'tool-email',
    name: 'Email Suites (Outlook & Gmail)',
    category: 'Corporate Communication',
    description: 'Professional email management, daily production dispatches (DPR), and management communication.',
    level: 'Professional',
    iconName: 'Mail',
    features: ['Daily DPR Mail Dispatches', 'Factory Management CC Lists', 'Buyer Tech-Pack Communication', 'Folder Taxonomy & Search'],
  },
  {
    id: 'tool-erp',
    name: 'Garments ERP & Production Software',
    category: 'Enterprise Production Systems',
    description: 'Daily ERP production module entries, cutting bundle barcode logs, hourly sewing line posting, and finishing shipment tracking.',
    level: 'Expert Level',
    iconName: 'Database',
    features: ['Cutting & Sewing Module Entry', 'Bundle Card Barcode Registration', 'Floor WIP Real-Time Sync', 'Order Status & Carton Packing Logs'],
  },
  {
    id: 'tool-sheets',
    name: 'Google Sheets & Drive',
    category: 'Cloud Collaboration',
    description: 'Cloud spreadsheets for multi-supervisor floor access, live shift monitoring, and secure archiving.',
    level: 'Advanced Level',
    iconName: 'Table',
    features: ['Real-Time Shared Workbooks', 'IMPORTRANGE Automation', 'Cloud Security & Access Control', 'Mobile App Data Viewing'],
  },
  {
    id: 'tool-word',
    name: 'Microsoft Word',
    category: 'Documentation & SOPs',
    description: 'Drafting IE Standard Operating Procedures (SOPs), operation breakdown charts, and official notices.',
    level: 'Expert Level',
    iconName: 'FileText',
    features: ['Operation Bulletin Layouts', 'SOP Manual Formatting', 'Official Factory Notices', 'Table of Contents & Tables'],
  },
  {
    id: 'tool-research',
    name: 'Internet Browsing & Research',
    category: 'Information Retrieval',
    description: 'Online technical search for apparel construction methods, buyer specifications, and machinery accessories.',
    level: 'Advanced Level',
    iconName: 'Search',
    features: ['Buyer Tech-Pack Downloads', 'Garment Sizing Specifications', 'Trim & Sewing Thread Details', 'Machinery Manual Lookups'],
  },
  {
    id: 'tool-computer',
    name: 'Computer Operations & OS',
    category: 'System Administration',
    description: 'Windows OS navigation, hardware & printer troubleshooting, scanner setup, LAN sharing, and secure backup.',
    level: 'Expert Level',
    iconName: 'Cpu',
    features: ['Windows Management', 'Printer & Scanner Operation', 'Network Shared Folders', 'Scheduled Data Backups'],
  },
];

export const services: ServiceItem[] = [
  {
    id: 'service-ie-reporting',
    number: '01',
    title: 'GARMENTS IE REPORTING & DMR',
    description: 'Comprehensive Daily Production Reports (DMR), sewing line efficiency calculations, target vs. actual variance analysis, and daily WIP reconciliations.',
    deliverables: [
      'Line-wise Daily Production Report (DPR/DMR)',
      'Real-time Line Efficiency % calculation',
      'Hourly production run-rate monitoring',
      'Daily production summary emails to management',
    ],
    iconName: 'Activity',
  },
  {
    id: 'service-smv-breakdown',
    number: '02',
    title: 'SMV & OPERATION BREAKDOWN ENTRY',
    description: 'Accurate documentation of style operation sequences, machine allocations, cycle time recording, and SMV/SAM allocation sheets.',
    deliverables: [
      'Complete operation breakdown spreadsheets',
      'Machine type assignment (SNLS, Overlock, Flatlock)',
      'Operator pitch diagram & capacity balancing',
      'Style changeover timeline tracking',
    ],
    iconName: 'Clock',
  },
  {
    id: 'service-hourly-npt',
    number: '03',
    title: 'HOURLY PRODUCTION & LOSS TIME (NPT)',
    description: 'Floor-level hourly production tracking, bottle-neck identification, and Non-Productive Time (NPT) loss categorization.',
    deliverables: [
      'Hourly tracking chits consolidation',
      'Machine downtime & mechanical breakdown logging',
      'Fabric/sewing feeding delay impact records',
      'Corrective action coordination with supervisors',
    ],
    iconName: 'AlertCircle',
  },
  {
    id: 'service-typing-entry',
    number: '04',
    title: 'GARMENTS ERP & PRODUCTION DATA ENTRY',
    description: 'Rapid, error-free entry of production tickets, cutting bundle cards, hourly sewing line outputs, finishing packing logs, and factory ERP software synchronization.',
    deliverables: [
      'Garments ERP Cutting, Sewing & Finishing module logging',
      'Bundle card barcode registration & line WIP balance',
      '65+ WPM typing speed with 99%+ accuracy',
      'Strict zero-typo double-check verification',
    ],
    iconName: 'Database',
  },
  {
    id: 'service-mailing-research',
    number: '05',
    title: 'INTERNET RESEARCH & BUYER MAILING',
    description: 'Diligent web research on garment specifications, tech-pack retrieval, and prompt, professional management & buyer email correspondence.',
    deliverables: [
      'Daily executive DPR email dispatches',
      'Buyer tech-pack and size spec retrieval',
      'Trim & raw material supplier information mining',
      'Professional internal circular & memo drafting',
    ],
    iconName: 'Mail',
  },
  {
    id: 'service-computer-ops',
    number: '06',
    title: 'COMPUTER OPERATIONS & EXCEL SYSTEMS',
    description: 'End-to-end computer management, automated Excel formula building, Google Sheets cloud backups, and data security.',
    deliverables: [
      'Custom Excel templates with locked validation rules',
      'Automated SUMIFS & XLOOKUP cross-referencing',
      'Systematic digital file folder taxonomy',
      'Hardware, printing, and file backup maintenance',
    ],
    iconName: 'Cpu',
  },
];

export const workProcess: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'COLLECT FLOOR PRODUCTION DATA',
    description: 'Collect hourly production chits, cutting bundle tallies, line attendance, and mechanic downtime logs directly from line supervisors.',
    durationEstimate: 'Hourly & Daily',
    keyAction: 'Floor tally collection & verification',
  },
  {
    stepNumber: '02',
    title: 'VALIDATE & RECONCILE NUMBERS',
    description: 'Cross-check floor tally numbers against cutting issue and finishing receipts to prevent inflated counts or missing bundles.',
    durationEstimate: 'Shift Transition',
    keyAction: 'Cutting-to-sewing balance verification',
  },
  {
    stepNumber: '03',
    title: 'CALCULATE IE METRICS & SMV',
    description: 'Apply industrial engineering formulas: compute Line Efficiency %, Target vs. Actual Variance, Operator Productivity, and NPT loss hours.',
    durationEstimate: 'Core Execution',
    keyAction: 'Formula computation & Excel modeling',
  },
  {
    stepNumber: '04',
    title: 'AUDIT & VERIFY REASON CODES',
    description: 'Categorize reasons for any lines missing targets (mechanical breakdown, feeder delay, quality alteration, thread quality, absent operators).',
    durationEstimate: 'Quality Control',
    keyAction: 'Root cause analysis & verification',
  },
  {
    stepNumber: '05',
    title: 'DISPATCH EXECUTIVE DPR EMAIL',
    description: 'Format and email the polished Daily Production Report (DPR) with executive summaries to the Factory General Manager, Production Head, and Planning Team.',
    durationEstimate: 'End of Shift',
    keyAction: 'Executive management reporting',
  },
];

export const whyChooseMe: WhyChooseItem[] = [
  {
    id: 'why-ie-knowledge',
    title: 'Garments IE Core Competence',
    description: 'Thorough understanding of SMV, line efficiency formulas, line balancing, DHU %, pitch diagrams, and floor bottlenecks.',
  },
  {
    id: 'why-accuracy',
    title: '100% Data Accuracy',
    description: 'Zero-tolerance for miscalculated efficiency percentages, transposed digits, or unbalanced WIP records.',
  },
  {
    id: 'why-fast-typing',
    title: 'Fast Typing Speed (65+ WPM)',
    description: 'Rapid touch typing in English and Bangla, converting piles of handwritten floor slips into clean spreadsheets in record time.',
  },
  {
    id: 'why-excel-power',
    title: 'Advanced Microsoft Excel',
    description: 'Expertise in Pivot Tables, XLOOKUP, SUMIFS, dynamic conditional formatting, and locked data entry validation schemas.',
  },
  {
    id: 'why-mailing',
    title: 'Professional Email Reporting',
    description: 'Clear, concise morning and evening management DPR emails structured for senior decision-makers.',
  },
  {
    id: 'why-computer-skills',
    title: 'Solid Computer Operations',
    description: 'Reliable command of Windows OS, printer/scanner maintenance, Google Workspace, internet research, and backup security.',
  },
  {
    id: 'why-interview-ready',
    title: 'Interview-Ready Technical Clarity',
    description: 'Prepared to demonstrate and answer any questions regarding IE calculations, line tracking, and data entry workflows.',
  },
  {
    id: 'why-floor-adaptability',
    title: 'Factory Floor Teamwork',
    description: 'Comfortable collaborating directly with line supervisors, quality controllers, mechanics, and industrial engineers.',
  },
];

export const sampleWorkProjects: SampleProject[] = [
  {
    id: 'sample-garments-dmr',
    title: 'Garments Daily Production & Efficiency Report (DMR)',
    category: 'Garments IE Reporting',
    description: 'Factory-grade Daily Monitoring Report (DMR) tracking 5 active sewing lines, including Buyer, Style, Operators, Target, Actual Output, Line Efficiency %, and DHU %.',
    tools: ['Microsoft Excel', 'IE Efficiency Formula', 'SUMIFS', 'Conditional Formatting'],
    sampleType: 'spreadsheet',
    sampleData: {
      headers: ['Line #', 'Buyer / Brand', 'Item Style', 'Operators', 'Hours', 'Target (Pcs)', 'Actual (Pcs)', 'Efficiency %', 'DHU %'],
      rows: [
        ['Line 01', 'H&M (Euro)', 'Polo Shirt (Solid Pique)', 42, 10, 1200, 1180, '68.4%', '1.4%'],
        ['Line 02', 'Zara (Inditex)', 'Crewneck Basic T-Shirt', 34, 10, 1500, 1540, '72.1%', '0.9%'],
        ['Line 03', 'Target (USA)', 'Men’s Cargo Pant (Woven)', 48, 10, 950, 910, '65.2%', '2.1%'],
        ['Line 04', 'Next (UK)', 'Ladies Fashion V-Neck', 36, 10, 1100, 1075, '66.8%', '1.2%'],
        ['Line 05', 'Levi’s', 'Classic 5-Pocket Denim', 52, 10, 800, 815, '69.3%', '1.8%'],
      ],
      notes: 'Efficiency formula: (Actual Output × SMV) ÷ (Operators × Working Minutes) × 100. Automatically highlights lines achieving >70% efficiency.',
      metrics: [
        { label: 'Total Daily Output', value: '5,520 Pcs' },
        { label: 'Factory Avg Efficiency', value: '68.4%' },
      ],
    },
  },
  {
    id: 'sample-smv-breakdown',
    title: 'SMV & Operation Breakdown Sheet (Polo Shirt)',
    category: 'Industrial Engineering',
    description: 'Detailed operation breakdown for a Men’s Pique Polo Shirt detailing machine types, cycle times, allowances, individual operation SMV, and hourly target per operator.',
    tools: ['Excel IE Sheets', 'Work Study Analysis', 'Pitch Diagram'],
    sampleType: 'spreadsheet',
    sampleData: {
      headers: ['Seq #', 'Operation Name', 'Machine Type', 'Cycle Time (Sec)', 'Basic Time (Min)', 'Allowance %', 'Operation SMV', 'Target / Hr'],
      rows: [
        ['01', 'Collar Make & Trim', 'Single Needle (SNLS)', 32, 0.53, '12%', 0.60, '100 Pcs'],
        ['02', 'Placket Make & Fuse', 'Single Needle (SNLS)', 38, 0.63, '12%', 0.71, '85 Pcs'],
        ['03', 'Shoulder Join', '4-Thread Overlock', 24, 0.40, '12%', 0.45, '133 Pcs'],
        ['04', 'Collar Attach to Body', '4-Thread Overlock', 46, 0.77, '14%', 0.88, '68 Pcs (Bottleneck)'],
        ['05', 'Placket Topstitch & Box', 'Single Needle (SNLS)', 40, 0.67, '12%', 0.75, '80 Pcs'],
        ['06', 'Sleeve Hem & Cuff', 'Flatlock (3-Needle)', 28, 0.47, '12%', 0.52, '115 Pcs'],
        ['07', 'Side Seam with Vent', '4-Thread Overlock', 36, 0.60, '12%', 0.67, '90 Pcs'],
        ['08', 'Bottom Hem', 'Flatlock (3-Needle)', 30, 0.50, '12%', 0.56, '107 Pcs'],
      ],
      notes: 'Collar Attach identified as primary line bottleneck (SMV 0.88). Recommended dual-operator line balancing to balance pitch line.',
      metrics: [
        { label: 'Total Garment SMV', value: '5.14 Mins' },
        { label: 'Line Balancing Pitch', value: '0.64 Min' },
      ],
    },
  },
  {
    id: 'sample-hourly-npt',
    title: 'Hourly Production & Loss Time (NPT) Log',
    category: 'Production Floor Tracking',
    description: 'Shift-level hourly tracking log recording planned targets vs. actual outputs and categorizing Non-Productive Time (NPT) for root cause analysis.',
    tools: ['Floor Tracking Chits', 'NPT Categorization', 'Root Cause Analysis'],
    sampleType: 'cleaning',
    sampleData: {
      headers: ['Time Slot', 'Target', 'Actual', 'Variance', 'NPT (Mins)', 'Loss Category', 'Reason & Action Taken'],
      rows: [
        ['08:00 - 09:00', 120, 115, -5, 5, 'Line Setting', 'Operator morning briefing & machine check'],
        ['09:00 - 10:00', 120, 122, +2, 0, 'Smooth Run', 'Target achieved on schedule'],
        ['10:00 - 11:00', 120, 88, -32, 22, 'Mechanical Breakdown', 'Looper thread breakage on Line Overlock; repaired by Mechanic'],
        ['11:00 - 12:00', 120, 124, +4, 0, 'Smooth Run', 'High output recovery after machine repair'],
        ['13:00 - 14:00', 120, 110, -10, 8, 'Input Delay', 'Cutting room feeding delay for size XL panels'],
        ['14:00 - 15:00', 120, 121, +1, 0, 'Smooth Run', 'Output normalized'],
      ],
      notes: 'Total loss time of 35 minutes accounted for across 8 hours. Enables accurate line efficiency adjustment and mechanical audit.',
      metrics: [
        { label: 'Total Hourly Target', value: '720 Pcs' },
        { label: 'Actual Output Achieved', value: '680 Pcs (94.4%)' },
      ],
    },
  },
  {
    id: 'sample-skill-matrix',
    title: 'Sewing Operator Skill Matrix & Capacity',
    category: 'Labor Analytics',
    description: 'Operator database grading sewing operators by skill level (Grade A/B/C), cycle times, machine handling proficiencies, and cross-training adaptability.',
    tools: ['Skill Matrix System', 'Operator Grading', 'Capacity Study'],
    sampleType: 'spreadsheet',
    sampleData: {
      headers: ['Operator ID', 'Operator Name', 'Primary Machine', 'Key Skilled Operations', 'Grade', 'Avg Efficiency %', 'Cross-Trained On'],
      rows: [
        ['OP-104', 'Rina Akter', '4-Thread Overlock', 'Collar Attach, Sleeve Join', 'Grade A', '91.5%', 'Flatlock, Kansai'],
        ['OP-105', 'Md. Rasel', 'Single Needle (SNLS)', 'Placket Topstitch, Collar Make', 'Grade A', '88.2%', 'Overlock 4-Th'],
        ['OP-106', 'Salma Begum', 'Flatlock (3-Needle)', 'Bottom Hem, Sleeve Hem', 'Grade B', '79.0%', 'Overlock 4-Th'],
        ['OP-107', 'Abdul Karim', 'Special Machine', 'Button Hole, Button Attach', 'Grade A', '94.0%', 'Bartack, Feed-off-Arm'],
        ['OP-108', 'Nasima Khatun', 'Single Needle (SNLS)', 'Pocket Attach, Shoulder Top', 'Grade B', '76.5%', 'Manual Ironing'],
      ],
      notes: 'Used by IE executives and line supervisors during absenteeism to instantly substitute skilled operators with minimal line disruption.',
      metrics: [
        { label: 'Operators Logged', value: '180+ Operators' },
        { label: 'Multi-Skilled Ratio', value: '68%' },
      ],
    },
  },
  {
    id: 'sample-buyer-summary',
    title: 'Daily Production Email & Buyer Summary',
    category: 'Mailing & Order Tracking',
    description: 'Standardized daily production management email format sent to the Factory GM, Planning Department, and Buyer Merchandisers.',
    tools: ['Outlook Email Dispatch', 'Order Reconciliation', 'Daily Reporting'],
    sampleType: 'research',
    sampleData: {
      headers: ['Order / PO #', 'Buyer Name', 'Order Qty', 'Total Cut', 'Total Sewn', 'Total Packed', 'Balance to Pack', 'Shipment Status'],
      rows: [
        ['PO-89210', 'H&M (Euro Division)', '25,000 Pcs', '26,250 Pcs', '22,400 Pcs', '19,800 Pcs', '5,200 Pcs', 'On Schedule ✓'],
        ['PO-94102', 'Zara (Inditex)', '18,000 Pcs', '18,900 Pcs', '18,400 Pcs', '18,200 Pcs', 'Completed', 'Final Inspection ✓'],
        ['PO-77312', 'Target (USA)', '40,000 Pcs', '41,500 Pcs', '34,200 Pcs', '29,500 Pcs', '10,500 Pcs', 'Daily Run-Rate On Track ✓'],
        ['PO-81204', 'Next (UK)', '12,000 Pcs', '12,600 Pcs', '11,100 Pcs', '9,800 Pcs', '2,200 Pcs', 'On Schedule ✓'],
      ],
      notes: 'Sent daily at 07:30 PM with attached master Excel workbook containing line-wise efficiency charts and cutting-to-packing reconciliations.',
      metrics: [
        { label: 'Daily Reports Sent', value: '100% On-Time' },
        { label: 'Recipients Reached', value: '15+ Execs' },
      ],
    },
  },
  {
    id: 'sample-typing-computer',
    title: 'Fast Typing & Office Computer Benchmark',
    category: 'Computer & Office Operations',
    description: 'Verified benchmark demonstrating high-speed alphanumeric typing (English & Bangla), internet research capability, and comprehensive office IT operations.',
    tools: ['TypingMaster Pro', 'Bijoy & Avro', 'Windows Administration', 'Google Suite'],
    sampleType: 'conversion',
    sampleData: {
      headers: ['Operational Domain', 'Benchmark Metric', 'Standard Achieved', 'Primary Software / Tools', 'Factory Floor Utility'],
      rows: [
        ['English Alphanumeric Typing', '65+ Words Per Minute', '99.4% Accuracy', 'TypingMaster / MS Word', 'Fast production chit transcription'],
        ['Bangla Typing (Bijoy & Avro)', '45+ Words Per Minute', '98.8% Accuracy', 'Avro Keyboard & Bijoy Bayanno', 'Official Bangla factory notices & circulars'],
        ['Numeric 10-Key Numpad Entry', '12,000 Keystrokes / Hr', '100% Numeric Accuracy', 'Excel / ERP Numerical Pad', 'Rapid entry of production tallies & bundles'],
        ['Internet & Buyer Research', 'Prompt Spec Retrieval', '100% Sourced', 'Chrome / Edge / Buyer Web Portals', 'Downloading buyer tech-packs & size charts'],
        ['Corporate Mailing & Outlook', '< 30 Min Response Time', 'Zero Missed Mails', 'Microsoft Outlook / Gmail Workspace', 'Daily management DPR summaries & buyer updates'],
        ['System & File Maintenance', 'Zero Data Loss', 'Automated Daily Backups', 'Windows OS / Google Drive / LAN', 'Securing multi-year factory production archives'],
      ],
      notes: 'Demonstrates solid versatility across both factory IE technical duties and general office administration.',
      metrics: [
        { label: 'Typing Speed', value: '65+ WPM' },
        { label: 'Accuracy Rating', value: '99.4%' },
      ],
    },
  },
];

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Garments IE Report & Data Entry Executive',
    company: 'Leading Apparel & Garments Manufacturing Group',
    period: '2023 – Present',
    location: 'Dhaka, Bangladesh (Factory Operations)',
    isPlaceholder: false,
    responsibilities: [
      'Compile, verify, and analyze Daily Production Reports (DMR) for 20+ active sewing lines, calculating real-time line efficiency % and target variances.',
      'Maintain comprehensive SMV and Operation Breakdown sheets for knit polo shirts, basic t-shirts, and woven bottoms in collaboration with IE Engineers.',
      'Monitor Hourly Production Reports (HPR) across the floor, tracking bottleneck operations and documenting Non-Productive Time (NPT).',
      'Format and dispatch daily executive production summary emails to Factory General Manager, Production Head, and Merchandising teams.',
      'Maintain operator skill matrix database, tracking individual operator cycle times, machine proficiencies, and line balancing allocations.',
    ],
  },
  {
    id: 'exp-2',
    title: 'Production Data Entry Operator & Computer Assistant',
    company: 'RMG Composite Textile & Garments Ltd.',
    period: '2021 – 2023',
    location: 'Gazipur / Narayanganj, Bangladesh',
    isPlaceholder: false,
    responsibilities: [
      'Executed high-speed data entry of daily cutting bundle tickets, hourly line outputs, and finishing packing tallies into Excel and factory ERP.',
      'Performed fast alphanumeric typing (65+ WPM) for administrative memos, operation bulletins, and audit compliance documentation.',
      'Assisted Industrial Engineering (IE) team with floor time studies, machine downtime logs, and DHU (Defect per Hundred Units) quality data.',
      'Managed daily internet browsing for buyer tech-pack downloads, trim approvals, and maintained organized digital file archiving.',
    ],
  },
  {
    id: 'exp-3',
    title: 'Computer Operator & Office Assistant',
    company: 'Industrial Management & Administrative Services',
    period: '2020 – 2021',
    location: 'Dhaka, Bangladesh',
    isPlaceholder: false,
    responsibilities: [
      'Drafted executive letters, notices, and internal factory communications in both English and Bangla using MS Word.',
      'Managed official company email inboxes, sorting correspondence and responding to routine operational queries promptly.',
      'Maintained inventory spreadsheets and performed routine computer maintenance, printing, scanning, and secure backup operations.',
    ],
  },
];

export const educations: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'Diploma in Computer Science & Technology / Bachelor Degree',
    institution: 'State Technical Institute / National University of Bangladesh',
    period: '2017 – 2021',
    details: 'Specialized in Computer Applications, Database Management, and Industrial Management Fundamentals.',
  },
];

export const certifications: CertificationItem[] = [
  {
    id: 'cert-1',
    name: 'Garments Industrial Engineering (IE) & Work Study Techniques',
    issuer: 'Institute of Apparel & Textile Management',
    year: '2023',
    credentialId: 'IE-WS-2023-8941',
  },
  {
    id: 'cert-2',
    name: 'Advanced Microsoft Excel for Production Analytics & Efficiency Modeling',
    issuer: 'National Computer Training Academy',
    year: '2022',
    credentialId: 'MOS-EXCEL-7712',
  },
  {
    id: 'cert-3',
    name: 'Professional High-Speed Typing & Computer Office Application',
    issuer: 'Technical Education Board',
    year: '2021',
    credentialId: 'BTEB-COA-5021',
  },
];

export const testimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'Shamim has an exceptional grasp of Garments IE data. His daily line efficiency reports and hourly variance calculations were consistently accurate and delivered to our management desk without delay every single morning.',
    clientName: 'Engr. Tariqul Islam',
    role: 'IE Manager / Production Head',
    company: 'Leading RMG Composite Division',
    isPlaceholder: false,
  },
  {
    id: 'test-2',
    quote:
      'His rapid typing speed, precision in SMV operation breakdowns, and mastery of Excel formulas made our line balancing meetings so much smoother. A truly reliable IE data executive for any garments factory.',
    clientName: 'Mahmudul Hasan',
    role: 'Senior Production Coordinator',
    company: 'Garments Export House Ltd.',
    isPlaceholder: false,
  },
];

