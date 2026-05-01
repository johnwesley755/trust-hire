import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaService } from '../../api/mediaService';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    url?: string;
}

interface AdvancedFileUploadProps {
    onUploadSuccess: (urls: string[]) => void;
    maxFiles?: number;
    label?: string;
}

export const AdvancedFileUpload: React.FC<AdvancedFileUploadProps> = ({ 
    onUploadSuccess, 
    maxFiles = 5,
    label = "Uploaded files"
}) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (newFiles: FileList | null) => {
        if (!newFiles) return;

        const incomingFiles = Array.from(newFiles).slice(0, maxFiles - files.length);
        
        const newUploads: UploadedFile[] = incomingFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            progress: 0,
            status: 'uploading'
        }));

        setFiles(prev => [...prev, ...newUploads]);

        for (let i = 0; i < incomingFiles.length; i++) {
            const file = incomingFiles[i];
            const uploadId = newUploads[i].id;

            try {
                const response = await mediaService.uploadFile(file, (progress) => {
                    setFiles(current => current.map(f => 
                        f.id === uploadId ? { ...f, progress } : f
                    ));
                });

                setFiles(current => {
                    const updated = current.map(f => 
                        f.id === uploadId ? { ...f, status: 'completed' as const, url: response.url, progress: 100 } : f
                    );
                    const completedUrls = updated.filter(f => f.status === 'completed').map(f => f.url!);
                    onUploadSuccess(completedUrls);
                    return updated;
                });
            } catch (err) {
                console.error('Upload error:', err);
                setFiles(current => current.map(f => 
                    f.id === uploadId ? { ...f, status: 'error' as const } : f
                ));
            }
        }
    };

    const removeFile = (id: string) => {
        setFiles(current => {
            const updated = current.filter(f => f.id !== id);
            const completedUrls = updated.filter(f => f.status === 'completed').map(f => f.url!);
            onUploadSuccess(completedUrls);
            return updated;
        });
    };

    return (
        <div className="w-full text-left">
            <div className="space-y-4">
                <label className="block text-xs font-bold text-[#1F3F34] uppercase tracking-wider">{label}</label>
                <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
                        ${isDragging ? 'border-[#FACD15] bg-[#FACD15]/5' : 'border-[#1F3F34]/10 bg-[#F5F4EF] hover:bg-white'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFiles(e.target.files)} 
                        className="hidden" 
                        multiple={maxFiles > 1}
                        accept=".png,.jpg,.webp"
                    />
                    
                    <div className="w-14 h-14 bg-[#FACD15] rounded-full flex items-center justify-center text-[#1F3F34] shadow-lg group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">add_a_photo</span>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-bold text-[#1F3F34]">Drag & drop photo here</p>
                        <p className="text-xs text-[#1F3F34]/50 mt-1">
                            or <span className="text-[#1F3F34] underline decoration-[#FACD15] decoration-2">browse files</span>
                        </p>
                    </div>
                </div>

                {/* Upload Status / File List */}
                <div className="space-y-3 mt-4">
                    <AnimatePresence mode="popLayout">
                        {files.map((file) => (
                            <motion.div
                                key={file.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-4 rounded-2xl flex items-center gap-4 group border border-[#1F3F34]/5 shadow-sm"
                            >
                                <div className="w-10 h-10 bg-[#F5F4EF] text-[#1F3F34] rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-xl">image</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1 gap-4">
                                        <span className="text-[#1F3F34] font-black text-xs truncate uppercase tracking-tight">
                                            {file.name}
                                        </span>
                                        {file.status === 'uploading' && (
                                            <span className="text-[#1F3F34]/40 font-black text-[10px] tabular-nums">
                                                {file.progress}%
                                            </span>
                                        )}
                                    </div>

                                    {file.status === 'uploading' ? (
                                        <div className="w-full h-1 bg-[#F5F4EF] rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${file.progress}%` }}
                                                className="h-full bg-[#FACD15]"
                                            />
                                        </div>
                                    ) : file.status === 'error' ? (
                                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">Upload failed</p>
                                    ) : (
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <span className="material-symbols-outlined text-xs font-bold">check_circle</span>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Ready</p>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 text-[#1F3F34]/20 hover:text-red-500"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
