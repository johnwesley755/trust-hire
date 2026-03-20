import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaService } from '../api/media.service';

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
                <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                    className={`
                        relative border-2 border-dashed rounded-4xl p-6 sm:p-8
                        flex flex-col items-center justify-center text-center transition-all
                        ${isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border bg-white'}
                        group cursor-pointer
                    `}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFiles(e.target.files)} 
                        className="hidden" 
                        multiple 
                        accept=".png,.jpg,.webp"
                    />
                    
                    <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                    </div>

                    <button 
                        type="button"
                        className="bg-brand-primary text-brand-secondary px-8 py-2.5 rounded-full font-bold text-sm shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all mb-4"
                    >
                        Browse
                    </button>

                    <p className="text-brand-muted font-medium text-xs mb-1">drop a file here</p>
                    <p className="text-brand-muted/40 text-[10px] font-bold">
                        <span className="text-brand-accent">*</span>File supported .png, .jpg & .webp
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-brand-secondary font-bold text-sm uppercase tracking-wider opacity-60">{label}</h3>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {files.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8 border border-dashed border-brand-border/30 rounded-2xl bg-brand-bg/10"
                                >
                                    <p className="text-brand-muted/40 font-bold text-xs uppercase tracking-widest">No files uploaded yet</p>
                                </motion.div>
                            ) : files.map((file) => (
                                <motion.div
                                    key={file.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
                                        <FileImage className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1 gap-4">
                                            <span className="text-brand-secondary font-bold text-sm truncate uppercase tracking-tight">
                                                {file.name}
                                            </span>
                                            {file.status === 'uploading' && (
                                                <span className="text-brand-muted/50 font-bold text-[10px] tabular-nums">
                                                    {file.progress}%
                                                </span>
                                            )}
                                        </div>

                                        {file.status === 'uploading' ? (
                                            <div className="w-full h-1.5 bg-brand-primary/10 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${file.progress}%` }}
                                                    className="h-full bg-brand-primary"
                                                />
                                            </div>
                                        ) : file.status === 'error' ? (
                                            <p className="text-brand-accent text-[10px] font-bold">Upload failed</p>
                                        ) : (
                                            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Ready</p>
                                        )}
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-brand-accent/10 text-brand-muted/40 hover:text-brand-accent"
                                    >
                                        {file.status === 'uploading' ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
