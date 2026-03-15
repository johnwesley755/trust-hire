import React, { useState, useRef } from 'react';
import { Camera, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/apiClient';

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
    currentImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, currentImage }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('DEBUG: Starting upload via Media Service...');

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError(null);

        // Show local preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/api/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
            onUploadSuccess(data.url);
            setIsUploading(false);
        } catch (err: unknown) {
            console.error('Upload error:', err);
            const errorMessage = (err as any).response?.data?.message || 'Failed to upload image via media service.';
            setError(errorMessage);
            setIsUploading(false);
            setPreview(currentImage || null);
        }
    };

    const removeImage = () => {
        setPreview(null);
        setError(null);
        onUploadSuccess('');
    };

    return (
        <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-brand-muted ml-1">Profile Image</label>
            
            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-4xl border-2 border-dashed border-brand-border bg-brand-surface flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all group"
                        >
                            <Camera className="w-8 h-8 text-brand-muted group-hover:text-brand-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-tighter text-brand-muted mt-2">Upload</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-32 h-32"
                        >
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover rounded-4xl border-2 border-brand-primary shadow-xl"
                            />
                            
                            {isUploading && (
                                <div className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm rounded-4xl flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                                </div>
                            )}

                            {!isUploading && (
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {!isUploading && (
                                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-start gap-2 text-brand-accent text-[10px] font-bold"
                    >
                        <AlertCircle className="w-3 h-3 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
