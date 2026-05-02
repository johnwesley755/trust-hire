import React, { useState, useRef } from 'react';
import {  } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaService } from '../../../services/media.service';

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

            const formData = new FormData();
            formData.append('file', file);

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
        <div className="w-full">
            <div className="space-y-4">
                <label className="block font-label text-xs font-bold text-primary uppercase tracking-wider">{label}</label>
                <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
                        ${isDragging ? 'border-primary-fixed bg-primary-fixed/10' : 'border-primary/10 bg-surface-container-low hover:bg-surface-container-high'}
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
                    
                    <div className="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">add_a_photo</span>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-bold text-primary">Drag & drop photo here</p>
                        <p className="text-xs text-primary/50 mt-1">
                            or <span className="text-primary underline decoration-primary-fixed decoration-2">browse files</span>
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
                                className="bg-surface-container-high p-4 rounded-xl flex items-center gap-4 group border border-primary/5"
                            >
                                <div className="w-10 h-10 bg-primary-fixed/20 text-primary rounded-lg flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-xl">image</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1 gap-4">
                                        <span className="text-primary font-bold text-xs truncate uppercase tracking-tight">
                                            {file.name}
                                        </span>
                                        {file.status === 'uploading' && (
                                            <span className="text-primary/40 font-black text-[10px] tabular-nums">
                                                {file.progress}%
                                            </span>
                                        )}
                                    </div>

                                    {file.status === 'uploading' ? (
                                        <div className="w-full h-1 bg-primary/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${file.progress}%` }}
                                                className="h-full bg-primary-fixed"
                                            />
                                        </div>
                                    ) : file.status === 'error' ? (
                                        <p className="text-error text-[10px] font-bold uppercase tracking-tight">Upload failed</p>
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
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-error/10 text-primary/20 hover:text-error"
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
