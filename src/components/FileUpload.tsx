import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileStatus {
  file: File;
  progress: number;
  status: 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
  error?: string;
}

export const FileUpload = () => {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const newFileStatuses: FileStatus[] = newFiles.map(f => ({
      file: f,
      progress: 0,
      status: 'IDLE'
    }));
    setFiles(prev => [...prev, ...newFileStatuses]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'IDLE') continue;

      const formData = new FormData();
      formData.append('files', files[i].file);

      try {
        setFiles(prev => {
          const next = [...prev];
          next[i].status = 'UPLOADING';
          return next;
        });

        await axios.post('/api/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
            setFiles(prev => {
              const next = [...prev];
              next[i].progress = progress;
              return next;
            });
          }
        });

        setFiles(prev => {
          const next = [...prev];
          next[i].status = 'SUCCESS';
          next[i].progress = 100;
          return next;
        });
      } catch (error) {
        setFiles(prev => {
          const next = [...prev];
          next[i].status = 'ERROR';
          next[i].error = 'فشل الرفع';
          return next;
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
          isDragging ? "border-gov-green bg-gov-green/5" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
        )}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gov-green/10 flex items-center justify-center text-gov-green">
            <Upload size={24} />
          </div>
          <div>
            <p className="font-bold text-sm">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-xs text-gov-text-secondary mt-1">يدعم الصور، PDF، والمستندات (بحد أقصى 10MB)</p>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2">
        <AnimatePresence>
          {files.map((fileStatus, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gov-text-secondary">
                <File size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-bold truncate">{fileStatus.file.name}</p>
                  <p className="text-[10px] text-gov-text-secondary">{(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fileStatus.progress}%` }}
                    className={cn(
                      "h-full transition-all duration-300",
                      fileStatus.status === 'ERROR' ? 'bg-red-500' : 'bg-gov-green'
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {fileStatus.status === 'UPLOADING' && <Loader2 size={16} className="animate-spin text-gov-green" />}
                {fileStatus.status === 'SUCCESS' && <CheckCircle2 size={16} className="text-gov-green" />}
                {fileStatus.status === 'ERROR' && <AlertCircle size={16} className="text-red-500" />}
                
                {fileStatus.status !== 'UPLOADING' && (
                  <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="p-1 hover:bg-gray-100 rounded-full text-gov-text-secondary">
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {files.length > 0 && files.some(f => f.status === 'IDLE') && (
        <button
          onClick={uploadFiles}
          className="w-full bg-gov-green text-white py-3 rounded-xl font-bold shadow-lg hover:bg-gov-green/90 transition-all active:scale-95"
        >
          بدء الرفع ({files.filter(f => f.status === 'IDLE').length} ملفات)
        </button>
      )}
    </div>
  );
};
