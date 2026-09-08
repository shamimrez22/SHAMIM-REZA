import React, { useState, useRef } from 'react';
import {
  FolderArchive,
  Upload,
  Download,
  Trash2,
  Edit2,
  FileSpreadsheet,
  FileText,
  FileCheck,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  File,
  Eye,
  Filter,
  X,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { VaultDocument, VaultFileType } from '../../types/portfolio';
import { detectFileType, formatFileSize, triggerFileDownload } from '../../utils/fileDownloader';

interface DataTabProps {
  documents: VaultDocument[];
  onAddDocument: (doc: VaultDocument) => void;
  onUpdateDocument: (id: string, updated: Partial<VaultDocument>) => void;
  onDeleteDocument: (id: string) => void;
  onDownloadDocument: (doc: VaultDocument) => void;
  theme: 'orange' | 'dark' | 'light';
}

export const DataTab: React.FC<DataTabProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  onDownloadDocument,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New Document Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Garments IE & SMV');
  const [formDescription, setFormDescription] = useState('');
  const [formFileData, setFormFileData] = useState<string>('');
  const [formFileName, setFormFileName] = useState<string>('');
  const [formFileSize, setFormFileSize] = useState<string>('');
  const [formFileSizeBytes, setFormFileSizeBytes] = useState<number>(0);
  const [formMimeType, setFormMimeType] = useState<string>('');
  const [formDetectedType, setFormDetectedType] = useState<VaultFileType>('other');
  const [formExtension, setFormExtension] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Categories available for selection
  const standardCategories = [
    'Garments IE & SMV',
    'SOP & Protocols',
    'Production Reports',
    'Line Balancing & Layout',
    'Costing & Consumption',
    'Official Reports',
    'Certificates & Documents',
    'Other Documents',
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Max file size 8MB for browser Base64 safety
    if (file.size > 8 * 1024 * 1024) {
      setFileError('ফাইল সাইজ ৮ মেগাবাইট (8MB) এর বেশি হতে পারবে না।');
      return;
    }

    const { type, extension } = detectFileType(file.name, file.type);
    const sizeStr = formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormFileData(result);
      setFormFileName(file.name);
      setFormFileSize(sizeStr);
      setFormFileSizeBytes(file.size);
      setFormMimeType(file.type || 'application/octet-stream');
      setFormDetectedType(type);
      setFormExtension(extension);

      // Auto-populate title if empty
      if (!formTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
        setFormTitle(cleanName);
      }
    };
    reader.onerror = () => {
      setFileError('ফাইল রিড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      setFileError('অনুগ্রহ করে ডকুমেন্টের একটি নাম বা শিরোনাম দিন।');
      return;
    }

    if (!formFileData) {
      setFileError('অনুগ্রহ করে একটি ফাইল সিলেক্ট করুন (Word, Excel, PDF ইত্যাদি)।');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (editingDoc) {
      // Update existing document
      onUpdateDocument(editingDoc.id, {
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        ...(formFileData !== editingDoc.fileData
          ? {
              fileName: formFileName,
              fileType: formDetectedType,
              fileExtension: formExtension,
              fileSize: formFileSize,
              fileSizeBytes: formFileSizeBytes,
              mimeType: formMimeType,
              fileData: formFileData,
              uploadDate: formattedDate,
            }
          : {}),
      });
      setEditingDoc(null);
    } else {
      // Add brand new document
      const newDoc: VaultDocument = {
        id: `vault_doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: formTitle.trim(),
        fileName: formFileName,
        fileType: formDetectedType,
        fileExtension: formExtension,
        fileSize: formFileSize,
        fileSizeBytes: formFileSizeBytes,
        mimeType: formMimeType,
        fileData: formFileData,
        category: formCategory,
        description: formDescription.trim(),
        uploadDate: formattedDate,
        createdAt: Date.now(),
      };
      onAddDocument(newDoc);
    }

    // Reset Form
    resetForm();
    setShowAddModal(false);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Garments IE & SMV');
    setFormDescription('');
    setFormFileData('');
    setFormFileName('');
    setFormFileSize('');
    setFormFileSizeBytes(0);
    setFormMimeType('');
    setFormDetectedType('other');
    setFormExtension('');
    setFileError(null);
    setEditingDoc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEdit = (doc: VaultDocument) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category || 'Garments IE & SMV');
    setFormDescription(doc.description || '');
    setFormFileData(doc.fileData);
    setFormFileName(doc.fileName);
    setFormFileSize(doc.fileSize);
    setFormFileSizeBytes(doc.fileSizeBytes || 0);
    setFormMimeType(doc.mimeType || '');
    setFormDetectedType(doc.fileType);
    setFormExtension(doc.fileExtension || '');
    setShowAddModal(true);
  };

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.fileType === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate stats
  const totalCount = documents.length;
  const excelCount = documents.filter((d) => d.fileType === 'excel').length;
  const wordCount = documents.filter((d) => d.fileType === 'word').length;
  const pdfCount = documents.filter((d) => d.fileType === 'pdf').length;
  const otherCount = totalCount - (excelCount + wordCount + pdfCount);

  const getFileBadge = (type: VaultFileType, ext: string) => {
    switch (type) {
      case 'excel':
        return {
          label: ext.replace('.', '').toUpperCase() || 'EXCEL',
          icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
          colorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'word':
        return {
          label: ext.replace('.', '').toUpperCase() || 'WORD',
          icon: <FileText className="w-4 h-4 text-blue-400" />,
          colorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'pdf':
        return {
          label: 'PDF',
          icon: <FileCheck className="w-4 h-4 text-rose-400" />,
          colorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'presentation':
        return {
          label: ext.replace('.', '').toUpperCase() || 'PPT',
          icon: <File className="w-4 h-4 text-amber-400" />,
          colorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      default:
        return {
          label: ext.replace('.', '').toUpperCase() || 'DOC',
          icon: <FileCode className="w-4 h-4 text-purple-400" />,
          colorClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
    }
  };

  return (
    <div className="space-y-6" id="admin-data-vault-panel">
      {/* 1. Header Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === 'orange'
            ? 'bg-[#1c130c] border-orange-800/60 shadow-lg shadow-orange-950/20'
            : theme === 'dark'
            ? 'bg-[#0b1329] border-slate-700 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                theme === 'orange'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              <FolderArchive className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  DATA &amp; DOCUMENT VAULT
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {totalCount} Documents Stored
                </span>
              </div>
              <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-2xl leading-relaxed">
                আপনার সমস্ত গুরুত্বপূর্ণ অফিসিয়াল ডকুমেন্টস (Word, Excel, PDF ইত্যাদি) এখানে আপলোড ও
                সংরক্ষণ করুন। পরবর্তীতে যে কোনো সময় এক ক্লিকে মূল ফাইলটি হুবহু (Original Format)
                ডাউনলোড করতে পারবেন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              id="btn-add-new-document"
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 text-white ${
                theme === 'orange'
                  ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-950/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/30'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ফাইল যোগ করুন (Add File)</span>
            </button>
          </div>
        </div>

        {/* Breakdown Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/40">
          <div
            onClick={() => setSelectedType('excel')}
            className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all ${
              selectedType === 'excel'
                ? 'border-emerald-500 bg-emerald-950/30'
                : 'border-slate-700/50 bg-slate-900/30 hover:border-emerald-500/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase">Excel &amp; Sheets</span>
              <p className="text-base font-black">{excelCount} Files</p>
            </div>
          </div>

          <div
            onClick={() => setSelectedType('word')}
            className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all ${
              selectedType === 'word'
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-slate-700/50 bg-slate-900/30 hover:border-blue-500/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase">Word Documents</span>
              <p className="text-base font-black">{wordCount} Files</p>
            </div>
          </div>

          <div
            onClick={() => setSelectedType('pdf')}
            className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all ${
              selectedType === 'pdf'
                ? 'border-rose-500 bg-rose-950/30'
                : 'border-slate-700/50 bg-slate-900/30 hover:border-rose-500/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-400 uppercase">PDF Documents</span>
              <p className="text-base font-black">{pdfCount} Files</p>
            </div>
          </div>

          <div
            onClick={() => setSelectedType('all')}
            className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all ${
              selectedType === 'all'
                ? 'border-purple-500 bg-purple-950/30'
                : 'border-slate-700/50 bg-slate-900/30 hover:border-purple-500/50'
            }`}
          >
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase">Total Files</span>
              <p className="text-base font-black">{totalCount} Stored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {uploadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 text-xs sm:text-sm font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>ডকুমেন্টটি সফলভাবে সংরক্ষিত হয়েছে! আপনি যে কোনো সময় এটি হুবহু ডাউনলোড করতে পারবেন।</span>
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="নাম বা ফাইল দিয়ে সার্চ করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-colors ${
              theme === 'orange'
                ? 'bg-[#18110b] border-orange-800/60 focus:border-orange-500 text-white'
                : theme === 'dark'
                ? 'bg-slate-900 border-slate-700 focus:border-blue-500 text-white'
                : 'bg-white border-slate-300 focus:border-blue-500 text-slate-900'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? theme === 'orange'
                  ? 'bg-orange-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {standardCategories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? theme === 'orange'
                    ? 'bg-orange-600 text-white'
                  : 'bg-blue-600 text-white'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Document Items List */}
      {filteredDocs.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            theme === 'orange'
              ? 'bg-[#18110b] border-orange-900/40'
              : theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <FolderArchive className="w-12 h-12 mx-auto opacity-40 mb-3" />
          <h3 className="text-base font-bold">কোনো ফাইল পাওয়া যায়নি</h3>
          <p className="text-xs opacity-70 mt-1 max-w-md mx-auto">
            {searchQuery
              ? 'আপনার সার্চ অনুযায়ী কোনো ডকুমেন্ট মিলেনি। অন্য কিছু লিখে খুঁজুন।'
              : 'আপনার ডাটা ভল্টে এখনো কোনো ফাইল যোগ করা হয়নি। উপরের বাটনে ক্লিক করে প্রথম ফাইলটি আপলোড করুন।'}
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ফাইল যোগ করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const badge = getFileBadge(doc.fileType, doc.fileExtension);

            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group hover:shadow-lg ${
                  theme === 'orange'
                    ? 'bg-[#19110b] border-orange-900/50 hover:border-orange-700/80 shadow-xs'
                    : theme === 'dark'
                    ? 'bg-[#0f172a] border-slate-800 hover:border-slate-700 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Row: File badge & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${badge.colorClass}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-60">
                        {doc.fileSize || 'Doc'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(doc)}
                        title="Edit Info"
                        className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-300 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `আপনি কি নিশ্চিত যে "${doc.title}" ডকুমেন্টটি ডিলিট করতে চান?`
                            )
                          ) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        title="Delete Document"
                        className="p-1.5 rounded-lg hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-black tracking-tight line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {doc.title}
                  </h4>

                  {/* Exact File Name */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono opacity-70 mt-1.5 text-slate-400 truncate">
                    <File className="w-3 h-3 shrink-0" />
                    <span className="truncate">{doc.fileName}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="mt-2.5">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {doc.category}
                    </span>
                  </div>

                  {/* Description if present */}
                  {doc.description && (
                    <p className="text-[11px] opacity-75 mt-2 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                {/* Bottom Row: Date & DOWNLOAD BUTTON */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] opacity-60">
                    <Clock className="w-3 h-3" />
                    <span>{doc.uploadDate || 'Saved'}</span>
                  </div>

                  {/* Direct Exact Download Button */}
                  <button
                    type="button"
                    onClick={() => onDownloadDocument(doc)}
                    id={`btn-download-vault-doc-${doc.id}`}
                    title={`Download exact original: ${doc.fileName}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-white active:scale-95 transition-all shadow-sm ${
                      doc.fileType === 'excel'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : doc.fileType === 'word'
                        ? 'bg-blue-600 hover:bg-blue-500'
                        : doc.fileType === 'pdf'
                        ? 'bg-rose-600 hover:bg-rose-500'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>হুবহু ডাউনলোড</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal: Add or Edit Document */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div
            className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all my-8 ${
              theme === 'orange'
                ? 'bg-[#18110b] border-orange-800/80 text-white'
                : theme === 'dark'
                ? 'bg-[#0f172a] border-slate-700 text-white'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingDoc ? 'ডকুমেন্ট তথ্য আপডেট করুন' : 'নতুন ফাইল আপলোড ও সংরক্ষণ করুন'}
                  </h3>
                  <p className="text-[11px] opacity-70">
                    Word, Excel, PDF যে কোনো ফাইল সরাসরি যুক্ত করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDocument} className="space-y-4 mt-4">
              {/* File Picker Box */}
              <div>
                <label className="block text-xs font-bold mb-1.5">
                  ফাইল সিলেক্ট করুন (Choose File) <span className="text-rose-400">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all ${
                    formFileData
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : 'border-slate-700 hover:border-blue-500 bg-slate-900/40 hover:bg-slate-900/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.xlsm,.csv,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.zip"
                  />
                  {formFileData ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        {formDetectedType === 'excel' ? (
                          <FileSpreadsheet className="w-6 h-6" />
                        ) : formDetectedType === 'word' ? (
                          <FileText className="w-6 h-6" />
                        ) : (
                          <FileCheck className="w-6 h-6" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-emerald-300 truncate max-w-[260px]">
                          {formFileName}
                        </p>
                        <p className="text-[10px] opacity-70">
                          {formDetectedType.toUpperCase()} • {formFileSize} • ফাইল সিলেক্টেড (ক্লিক
                          করে পরিবর্তন করুন)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto opacity-50 mb-1 text-blue-400" />
                      <p className="text-xs font-bold text-blue-400">
                        ক্লিক করে Word, Excel, PDF ফাইল বেছে নিন
                      </p>
                      <p className="text-[10px] opacity-60 mt-0.5">
                        সমর্থিত ফরম্যাট: .docx, .doc, .xlsx, .xls, .csv, .pdf, .txt, .zip (Max 8MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  ডকুমেন্টের নাম বা শিরোনাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: লাইন ব্যালান্সিং ও এসএমভি শীট ২০২৬"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm ${
                    theme === 'orange'
                      ? 'bg-[#100b07] border-orange-800/80 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold mb-1">ক্যাটাগরি (Category)</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm ${
                    theme === 'orange'
                      ? 'bg-[#100b07] border-orange-800/80 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {standardCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold mb-1">সংক্ষিপ্ত নোট / বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  rows={2}
                  placeholder="এই ডকুমেন্টে কী কী তথ্য আছে তার সংক্ষিপ্ত বিবরণ..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                    theme === 'orange'
                      ? 'bg-[#100b07] border-orange-800/80 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-900 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Error Message */}
              {fileError && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-md ${
                    theme === 'orange'
                      ? 'bg-orange-600 hover:bg-orange-500'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingDoc ? 'সংরক্ষণ করুন' : 'ফাইল আপলোড ও সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
