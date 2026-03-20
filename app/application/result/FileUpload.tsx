"use client"

import React, { useState, useRef, DragEvent, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faCloudUploadAlt,
    faTimes,
    faFileImage,
    faCheckCircle,
    faExclamationCircle,
    faSpinner,
    faFileInvoiceDollar
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

    initialFileName?: string;

    onChange?: (file: File | null) => void;
    onUploadSuccess?: (response: any) => void;
    onUploadError?: (error: any) => void;

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
                                                   url,
                                                   fetchUrl,
                                                   fieldName = "file",
                                                   headers = {},
                                                   withCredentials = true,
                                                   additionalData = {},
                                                   initialFileName = "สลิปโอนเงิน",
                                                   onChange,
                                                   onUploadSuccess,
                                                   onUploadError,
                                                   label = "อัปโหลดสลิปการโอนเงิน",
                                                   description = "ลากและวาง หรือ คลิกตรงนี้เพื่ออัปโหลดสลิป",
                                                   className,
                                                   height = "h-90",
                                                   uploadIcon = faCloudUploadAlt
                                               }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [isUploaded, setIsUploaded] = useState(false);
    const [serverFileName, setServerFileName] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!fetchUrl || file || isUploaded) return;

        const fetchExistingFile = async () => {
            setIsFetching(true);
            try {
                const response = await axios.get(fetchUrl, {
                    withCredentials: withCredentials,
                    headers: headers
                });

                if (response.data.status !== 404 && response.data[0]) {
                    setServerFileName(response.data[0].file_originalname);
                    setIsUploaded(true);
                }
            } catch (err) {
                console.error("Error fetching existing slip:", err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchExistingFile();
    }, [fetchUrl, file, isUploaded, withCredentials, headers]);

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

    const handleFileSelection = async (selectedFile: File) => {
        if (isUploaded) return;

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
        setIsUploaded(false);

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
            setIsUploaded(true);
            if (onChange) onChange(selectedFile);
            if (onUploadSuccess) onUploadSuccess(response.data);

        } catch (err: any) {
            console.error("Upload Error:", err);
            if (err.response?.status === 500) {
                setError("ตรวจสอบไม่สำเร็จ กรุณาลองอีกครั้งหรือส่งให้ทางทีมงานโดยตรง");
                setFile(null);
                setIsUploaded(false);
            } else {
                const errorMessage = err.response?.data?.message || err.message || "สลิปไม่ถูกต้อง หรือการอัปโหลดล้มเหลว";
                setError(errorMessage);
                setFile(null);
                setIsUploaded(false);
            }
            if (onUploadError) onUploadError(err);
        } finally {
            setIsUploading(false);
        }
    };

    const displayAccept: string = accept.split(',').map(item => {
        const type = item.trim();
        if (type === 'image/*') return 'รูปภาพทุกชนิด';
        if (type === '.pdf') return 'PDF';
        return type.replace('.', '').toUpperCase();
    }).join(', ');

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isUploading || isFetching || isUploaded) return;
        setIsDragging(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (isUploading || isFetching || isUploaded) return;
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) handleFileSelection(droppedFile);
    };

    const hasContent = isUploaded;
    const displayFileName = file ? file.name : (serverFileName || initialFileName);
    const isLoading = isUploading || isFetching;

    return (
        <div
            onDragOver={handleDrag}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn("w-full mx-auto relative", className)}>

            <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                className="hidden"
                accept={accept}
                disabled={isUploaded || isLoading}
            />

            <div className={cn("relative w-full rounded-xl transition-all overflow-hidden bg-twilight-indigo-800 border",
                hasContent ? "border-green-500/50" : "border-twilight-indigo-700",
                height)}>

                {/* ⭐️ ย้าย ERROR MESSAGE เข้ามาไว้ตรงนี้และใช้ ABSOLUTE เพื่อให้มันลอยทับ ไม่ดันความสูงกล่อง ⭐️ */}
                {error && !isUploaded && (
                    <div className="absolute top-3 left-3 right-3 z-30 p-3 text-xs text-red-200 bg-red-900/90 backdrop-blur-md border border-red-500/50 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-lg">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-base text-red-400 shrink-0" />
                        <span className="flex-1 truncate">{error}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // กันไม่ให้ไปเผลอกดเปิด input ไฟล์
                                setError(null);
                            }}
                            className="ml-auto hover:text-red-100 p-1"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                )}

                {/* LOADING & VERIFYING STATE */}
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-twilight-indigo-800/95 backdrop-blur-sm">
                        <div className="relative mb-3">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
                            {isUploading && progress < 100 && (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white">
                                     {progress}%
                                 </span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-twilight-indigo-300 mb-2">
                            {isFetching
                                ? "กำลังดึงข้อมูลสลิป..."
                                : (progress === 100 ? "กำลังตรวจสอบสลิป..." : "กำลังอัปโหลดสลิป...")}
                        </p>
                        {isUploading && progress < 100 && (
                            <div className="w-48 h-1.5 bg-twilight-indigo-700 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                    </div>
                )}

                {/* EMPTY STATE (พร้อมอัปโหลด) */}
                {!hasContent && !isLoading && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-full w-full"
                    >
                        <div className={cn("flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl transition-all cursor-pointer",
                            isDragging
                                ? "border-primary bg-twilight-indigo-700/50"
                                : "border-twilight-indigo-700 hover:bg-twilight-indigo-700/30"
                        )}>
                            <div className="p-4 mb-3 rounded-full bg-twilight-indigo-800/80 shadow-sm">
                                <FontAwesomeIcon icon={uploadIcon} className="text-3xl text-twilight-indigo-400" />
                            </div>
                            <h3 className="font-semibold text-white text-sm">{label}</h3>
                            <p className="text-xs text-twilight-indigo-400 mt-1">{description}</p>
                            <div className="mt-4 flex flex-col gap-1.5 items-center">
                                <div className=" px-2 py-1 rounded-md bg-twilight-indigo-900/50 text-[10px] text-twilight-indigo-500 font-mono">
                                    ขนาดไฟล์สูงสุด: {maxSizeMB} MB
                                </div>
                                {accept && (
                                    <span className="text-[10px] text-twilight-indigo-500 bg-twilight-indigo-900/50 px-2 py-1 rounded-md max-w-[200px] truncate">
                                        ไฟล์ที่รองรับ: {displayAccept}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* SUCCESS STATE (ตรวจสอบผ่าน ล็อคกล่องนี้ทันที) */}
                {hasContent && !isLoading && (
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-twilight-indigo-800 relative select-none">
                        <div className="mb-4 relative flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-green-500" />
                        </div>

                        <h3 className="text-green-400 font-semibold text-lg text-center mb-1">
                            ตรวจสอบสลิปสำเร็จ
                        </h3>
                        <p className="text-xs text-twilight-indigo-300 text-center truncate w-full max-w-[80%] mb-2">
                            {displayFileName}
                        </p>
                        <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-green-500/10 rounded-md border border-green-500/20">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-green-500 text-xs" />
                            <span className="text-xs font-medium text-green-400">ระบบบันทึกการชำระเงินเรียบร้อยแล้ว</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;