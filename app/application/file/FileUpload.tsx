"use client"

import React, { useState, useRef, DragEvent, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faCloudUploadAlt,
    faTimes,
    faFileAlt,
    faFileImage,
    faFilePdf,
    faFileWord,
    faTrashAlt,
    faSyncAlt,
    faCheckCircle,
    faExclamationCircle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { cn } from "@/lib/utils";

interface FileUploadProps {
    name?: string;
    accept?: string;
    maxSizeMB?: number;

    url: string;
    fetchUrl?: string | null;

    fieldName?: string;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    additionalData?: Record<string, string>;

    initialFileName?: string; // ชื่อไฟล์ที่จะแสดงตอนโหลดมาแล้ว

    onChange?: (file: File | null) => void;
    onUploadSuccess?: (response: any) => void;
    onUploadError?: (error: any) => void;
    onRemove?: () => void;

    label?: string;
    description?: string;
    className?: string;
    height?: string;
    uploadIcon?: IconDefinition;
}

const FileUpload: React.FC<FileUploadProps> = ({
                                                   name,
                                                   accept = "image/*",
                                                   maxSizeMB = 5,
                                                   url,            // สำหรับ Upload
                                                   fetchUrl,       // สำหรับ Download (GET)
                                                   fieldName = "file",
                                                   headers = {},
                                                   withCredentials = true,
                                                   additionalData = {},
                                                   initialFileName = "ไฟล์เดิม",
                                                   onChange,
                                                   onUploadSuccess,
                                                   onUploadError,
                                                   onRemove,
                                                   label = "อัปโหลดไฟล์",
                                                   description = "ลากและวาง หรือ คลิกตรงนี้เพื่ออัปโหลดไฟล์",
                                                   className,
                                                   height = "h-90",
                                                   uploadIcon = faCloudUploadAlt
                                               }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isPDF, setIsPDF] = useState<boolean | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Loading States
    const [isUploading, setIsUploading] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // เพิ่มสถานะกำลังโหลดไฟล์เก่า

    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Effect: ดึงไฟล์เก่าจาก fetchUrl เมื่อ Component โหลด หรือ fetchUrl เปลี่ยน
    useEffect(() => {
        // ถ้ามีไฟล์ใหม่อยู่แล้ว หรือไม่มี URL ให้ดึง หรือมี preview อยู่แล้ว(จากการเลือกไฟล์) -> ไม่ต้องทำ
        if (!fetchUrl || file) return;

        const fetchExistingFile = async () => {
            setIsFetching(true);
            try {
                // ยิง GET ไปดึงไฟล์ แบบ Blob
                const response = await axios.get(fetchUrl, {
                    withCredentials: withCredentials,
                    headers: headers
                });

                if (response.data.status == 404) {

                } else {
                    setIsPDF(response.data[0].file_originalname.toLowerCase().includes('.pdf'));
                    setPreviewUrl(response.data[0].file_url);
                }

            } catch (err) {
                console.error("Error fetching existing file:", err);
                setIsPDF(null);
                setPreviewUrl(null);
            } finally {
                setIsFetching(false);
            }
        };

        fetchExistingFile();

        // Cleanup URL เมื่อ fetchUrl เปลี่ยนหรือ unmount
        return () => {
            if (previewUrl && !file) {
                URL.revokeObjectURL(previewUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchUrl]);

    // 2. Effect: สร้าง Preview เมื่อเลือกไฟล์ใหม่จากเครื่อง
    useEffect(() => {
        if (!file) return;
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    // ... (Validate Function เดิม) ...
    const validateFileType = (file: File, acceptString: string): boolean => {
        if (!acceptString || acceptString === '*') return true;
        const acceptedTypes = acceptString.split(',').map(type => type.trim().toLowerCase());
        const fileName = file.name.toLowerCase();
        const fileType = file.type.toLowerCase();

        return acceptedTypes.some(type => {
            if (type.startsWith('.')) return fileName.endsWith(type);
            if (type.endsWith('/*')) return fileType.startsWith(type.split('/')[0]);
            return fileType === type;
        });
    };

    // ... (Handle Selection เดิม เปลี่ยน isLoading เป็น isUploading) ...
    const handleFileSelection = async (selectedFile: File) => {
        setError(null);
        if (!validateFileType(selectedFile, accept)) {
            setError(`ไม่รองรับไฟล์ประเภทนี้ กรุณาอัปโหลด: ${accept}`);
            return;
        }
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            setError(`ขนาดไฟล์เกิน ${maxSizeMB}MB`);
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append(fieldName, selectedFile);
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response: AxiosResponse = await axios.post(url, formData, {
                withCredentials: withCredentials,
                headers: { 'Content-Type': 'multipart/form-data', ...headers },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                },
            });

            setFile(selectedFile);
            if (onChange) onChange(selectedFile);
            if (onUploadSuccess) onUploadSuccess(response.data);

        } catch (err: any) {
            console.error("Upload Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "การอัปโหลดล้มเหลว";
            setError(errorMessage);
            setFile(null);
            setPreviewUrl(null); // Reset preview ถ้าอัปไม่ผ่าน
            if (onUploadError) onUploadError(err);
        } finally {
            setIsUploading(false);
        }
    };

    // ... (Drag & Drop handlers เดิม) ...
    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isUploading || isFetching) return;
        setIsDragging(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (isUploading || isFetching) return;
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) handleFileSelection(droppedFile);
    };

    const removeFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onChange) onChange(null);
        if (onRemove) onRemove();
    };

    // ... (Get Icon เดิม) ...
    const getFileIcon = (fileName: string) => {
        const lower = fileName.toLowerCase();
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp'))
            return <FontAwesomeIcon icon={faFileImage} className="text-2xl text-white" />;
        if (lower.endsWith('.pdf')) return <FontAwesomeIcon icon={faFilePdf} className="text-2xl text-white" />;
        if (lower.endsWith('.doc') || lower.endsWith('.docx')) return <FontAwesomeIcon icon={faFileWord} className="text-2xl text-white" />;
        return <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-white" />;
    };

    // Logic การแสดงผล
    const hasContent = file !== null || (previewUrl !== null && previewUrl !== "");
    const displayFileName = file ? file.name : initialFileName;
    const displaySize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "";
    const isLoading = isUploading || isFetching; // รวมสถานะโหลด

    return (
        <div className={cn("w-full mx-auto", className)}>
            <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                className="hidden"
                accept={accept}
            />

            {error && (
                <div className="mb-2 p-2 text-xs text-red-400 bg-red-900/20 border border-red-900/50 rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                    <button onClick={() => setError(null)} className="ml-auto hover:text-red-300">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}

            <div className={cn("relative w-full rounded-xl transition-all overflow-hidden bg-slate-800 border border-slate-700", height)}>

                {/* LOADING STATE */}
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-800/95 backdrop-blur-sm">
                        <div className="relative mb-3">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
                            {isUploading && ( // แสดง % เฉพาะตอน Upload
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white">
                                     {progress}%
                                 </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-slate-300 mb-2">
                            {isFetching ? "กำลังดึงข้อมูลไฟล์..." : "กำลังอัปโหลด..."}
                        </p>
                        {isUploading && (
                            <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!hasContent && !isLoading && (
                    <div
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="h-full w-full"
                    >
                        <div className={cn("flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl transition-all cursor-pointer",
                            isDragging
                                ? "border-primary bg-slate-700/50"
                                : "border-slate-700 hover:bg-slate-700/30"
                        )}>
                            <div className="p-4 mb-3 rounded-full bg-slate-800/80 shadow-sm">
                                <FontAwesomeIcon icon={uploadIcon} className="text-3xl text-slate-400" />
                            </div>
                            <h3 className="font-semibold text-white text-sm">{label}</h3>
                            <p className="text-xs text-slate-400 mt-1">{description}</p>
                            <div className="mt-4 flex flex-col gap-1.5 items-center">
                                <div className=" px-2 py-1 rounded-md bg-slate-900/50 text-[10px] text-slate-500 font-mono">
                                    ขนาดไฟล์สูงสุด: {maxSizeMB} MB
                                </div>
                                {accept && (
                                    <span className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md max-w-[200px] truncate">
                                        ไฟล์ที่รองรับ: {accept.replace(/,/g, ', ')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT STATE */}
                {hasContent && !isLoading && (
                    <div className="h-full w-full flex flex-col">
                        <div className="flex items-center gap-3 p-3 border-b border-slate-700 h-[60px] shrink-0 bg-slate-800">
                            <div className="h-10 w-10 shrink-0 rounded bg-slate-700 flex items-center justify-center">
                                {getFileIcon(displayFileName || "unknown")}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-white">{displayFileName}</p>
                                <p className="text-[10px] text-slate-400">
                                    {file ? `${displaySize} • อัปโหลดเสร็จสิ้น` : "ไฟล์ปัจจุบันบนระบบ"}
                                </p>
                            </div>
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-lg" />
                        </div>

                        <div className="flex-1 min-h-0 bg-slate-900/50 flex items-center justify-center relative overflow-hidden">
                            {previewUrl ? (
                                isPDF ? (
                                    // กรณีเป็น PDF (หรือโหลดรูปไม่ผ่าน) -> ใช้ iframe/embed
                                    // Browser จะจัดการพื้นหลังให้เอง (มักจะเป็นสีเทาเข้ม)
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full border-none"
                                        title="Preview"
                                    />
                                ) : (
                                    // กรณีปกติ -> ลองโหลดเป็นรูปก่อน
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-contain p-4 rounded-md"
                                        // หัวใจสำคัญอยู่ตรงนี้:
                                        // ถ้ารูปโหลดไม่ได้ (เพราะมันเป็น PDF) มันจะฟ้อง Error
                                        // เราก็ดัก Error นั้นเพื่อสลับไปโหมด PDF ทันที
                                        onError={() => setIsPDF(true)}
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center text-slate-500 opacity-60">
                                    <FontAwesomeIcon icon={faFileAlt} className="text-4xl mb-2" />
                                    <span className="text-xs">ไม่สามารถแสดงตัวอย่างได้</span>
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-slate-700 bg-slate-800 h-[50px] shrink-0 flex gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-[2] flex items-center justify-center gap-2 text-xs font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                            >
                                <FontAwesomeIcon icon={faSyncAlt} className="text-xs" /> เปลี่ยน
                            </button>
                            {/*
                            <button
                                onClick={removeFile}
                                className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-white bg-red-900/80 hover:bg-red-800 rounded-md transition-colors"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} className="text-xs" /> ลบ
                            </button>
                            */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;