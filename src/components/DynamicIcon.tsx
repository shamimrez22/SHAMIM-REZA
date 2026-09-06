import React from 'react';
import {
  Database,
  FileSpreadsheet,
  FileText,
  Table,
  Files,
  Sparkles,
  CheckCheck,
  Search,
  FileCheck,
  Keyboard,
  FolderArchive,
  Grid,
  Briefcase,
  Mail,
  HardDrive,
  Check,
  ShieldCheck,
  Clock,
  Award,
  GraduationCap,
  Layers,
  LucideProps,
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Database':
      return <Database {...props} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Table':
      return <Table {...props} />;
    case 'Files':
      return <Files {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'CheckCheck':
      return <CheckCheck {...props} />;
    case 'Search':
      return <Search {...props} />;
    case 'FileCheck':
      return <FileCheck {...props} />;
    case 'Keyboard':
      return <Keyboard {...props} />;
    case 'FolderArchive':
      return <FolderArchive {...props} />;
    case 'Grid':
      return <Grid {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Mail':
      return <Mail {...props} />;
    case 'HardDrive':
      return <HardDrive {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <Check {...props} />;
  }
};
