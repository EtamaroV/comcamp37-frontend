"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// --- Helper: Shadow Logic (ใช้ร่วมกันได้เลยถ้าอยู่ในไฟล์เดียวกัน) ---
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

interface LearningFolderProps extends React.HTMLAttributes<HTMLDivElement> {
    color1?: string
    color2?: string
    color3?: string
}

// --- Mobile Component (The Mobile Folder SVG) ---
const LearningFolderMobile = React.forwardRef<HTMLDivElement, LearningFolderProps>(
    ({ className, children, color1 = "#F4D471", color2 = "#FFAA2B", color3 = "#FFA114", ...props }, ref) => {

        const id = React.useId();
        const filterDynamicId = `mobile-shadow-${id.replace(/:/g, "")}`;
        const filterStaticId = `mobile-shadow-black-${id.replace(/:/g, "")}`;

        const rgb = hexToRgb(color1);
        const matrixValues = `0 0 0 0 ${rgb.r / 255} 0 0 0 0 ${rgb.g / 255} 0 0 0 0 ${rgb.b / 255} 0 0 0 1 0`;

        return (
            <div ref={ref} className={cn("relative w-full max-w-[393px] mx-auto", className)} {...props}>
                <svg viewBox="0 0 393 733" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
                    <g filter={`url(#${filterDynamicId})`}>
                        <g filter={`url(#${filterStaticId})`}>
                            {/* Back Folder */}
                            <path d="M27.22 695.598H365.281C368.716 695.598 371.5 692.813 371.5 689.379V113.844C371.5 110.41 368.716 107.625 365.281 107.625L225.437 107.625L192.025 107.625C190.021 107.625 188.14 106.66 186.972 105.032L146.943 49.2364C145.775 47.6082 143.894 46.6426 141.89 46.6426L27.22 46.6426C23.7854 46.6426 21.001 49.427 21.001 52.8616V689.379C21.001 692.813 23.7853 695.598 27.22 695.598Z" fill={color1} />
                            {/* Front Folder */}
                            <path d="M365.28 695.597H27.219C23.7843 695.597 21 692.813 21 689.378V204.705C21 201.27 23.7843 198.486 27.219 198.486H200.357C203.378 198.486 205.962 196.315 206.483 193.339L215.466 142.016C215.987 139.04 218.571 136.869 221.592 136.869H365.28C368.715 136.869 371.499 139.653 371.499 143.088V689.378C371.499 692.813 368.715 695.597 365.28 695.597Z" fill={color2} />
                            {/* Decorative Corner */}
                            <path d="M371.085 690.424C371.085 693.858 368.301 696.642 364.866 696.643H162.141C231.346 648.291 312.116 556.829 371.085 399.247V690.424Z" fill={color3} />
                        </g>
                    </g>

                    {/* --- CONTENT AREA (แทนที่กรอบสีเทาและ Dummy Content เดิม) --- */}
                    {/* x, y, width, height อ้างอิงจาก <rect> เดิมใน SVG */}
                    <foreignObject x="38" y="125.643" width="320" height="560">
                        <div className="w-full h-full bg-[#E5E7EB] rounded-[10px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] flex flex-col p-6 box-border overflow-y-auto">
                            {children}
                        </div>
                    </foreignObject>

                    <defs>
                        {/* Dynamic Color Shadow */}
                        <filter id={filterDynamicId} x="-11.3388" y="11.8162" width="425.128" height="724.628" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="4.9752" dy="2.4876" />
                            <feGaussianBlur stdDeviation="18.657" />
                            <feComposite in2="hardAlpha" operator="out" />
                            {/* ใช้ matrixValues จาก color1 แทนค่าคงที่ */}
                            <feColorMatrix type="matrix" values={matrixValues} />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                        </filter>

                        {/* Base Black Shadow */}
                        <filter id={filterStaticId} x="20.6425" y="50" width="350.223" height="640.723" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="6.219" dy="6.219" />
                            <feGaussianBlur stdDeviation="0" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                        </filter>
                    </defs>
                </svg>
            </div>
        )
    }
)
LearningFolderMobile.displayName = "LearningFolderMobile"

export { LearningFolderMobile }