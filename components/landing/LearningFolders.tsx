"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// --- Helper: Shadow Logic ---
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// --- Types ---
interface LearningFolderProps extends React.HTMLAttributes<HTMLDivElement> {
    color1?: string
    color2?: string
    color3?: string
}

// --- 1. Root Component (The Folder SVG) ---
const LearningFolder = React.forwardRef<HTMLDivElement, LearningFolderProps>(
    ({ className, children, color1 = "#F4D471", color2 = "#FFAA2B", color3 = "#FFA114", ...props }, ref) => {

        const id = React.useId();
        const filterId = `folder-shadow-${id.replace(/:/g, "")}`;
        const rgb = hexToRgb(color1);
        const matrixValues = `0 0 0 0 ${rgb.r / 255} 0 0 0 0 ${rgb.g / 255} 0 0 0 0 ${rgb.b / 255} 0 0 0 1 0`;

        return (
            <div ref={ref} className={cn("relative w-full mx-auto translate-x-0.5 md:translate-0 scale-110 md:scale-100", className)} {...props}>
                <svg viewBox="0 0 845 533" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    {/* Back Folder */}
                    <g filter={`url(#${filterId})`}>
                        <path d="M38.5575 493.171H796.031C799.466 493.171 802.25 490.387 802.25 486.952V101.911C802.25 98.4762 799.466 95.6919 796.031 95.6919L481.406 95.6918H192.038C190.226 95.6918 188.503 94.901 187.322 93.5264L138.733 36.9916C137.552 35.617 135.829 34.8262 134.017 34.8262L38.5574 34.8262C35.1228 34.8262 32.3384 37.6106 32.3384 41.0452V486.952C32.3384 490.387 35.1228 493.171 38.5575 493.171Z" fill={color1} />
                    </g>
                    {/* Front Folder */}
                    <path d="M796.031 493.172H38.5569C35.1222 493.172 32.3379 490.388 32.3379 486.953V163.335C32.3379 159.9 35.1222 157.116 38.5569 157.116H434.177C436.413 157.116 438.477 155.915 439.583 153.971L459.696 118.606C460.801 116.663 462.865 115.462 465.101 115.462H796.031C799.465 115.462 802.25 118.246 802.25 121.681V486.953C802.25 490.388 799.465 493.172 796.031 493.172Z" fill={color2} />
                    {/* Decorative Corner */}
                    <path d="M801.341 487.659C801.341 491.094 798.557 493.878 795.122 493.878H342.377C494.391 461.192 671.809 399.363 801.341 292.838V487.659Z" fill={color3} />

                    {/* --- CONTENT AREA --- */}
                    <foreignObject x="65" y="180" width="715" height="290">
                        <div className="w-full h-full bg-gray-300 rounded-xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] flex items-center justify-between p-8 box-border overflow-hidden">
                            {children}
                        </div>
                    </foreignObject>

                    <defs>
                        <filter id={filterId} x="-0.000887871" y="-0.000205517" width="844.54" height="532.973" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="4.9752" dy="2.4876" />
                            <feGaussianBlur stdDeviation="18.657" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values={matrixValues} />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_434_115" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_434_115" result="shape" />
                        </filter>
                    </defs>
                </svg>
            </div>
        )
    }
)
LearningFolder.displayName = "LearningFolder"

// --- 2. Sub-components ---

const LearningContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col gap-3 w-1/1 md:w-2/3 pr-4", className)} {...props}>
            {children}
        </div>
    )
)
LearningContent.displayName = "LearningContent"

const LearningTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-3xl font-bold text-black tracking-tight mb-3 md:mb-5", className)} {...props}>
            {children}
        </h3>
    )
)
LearningTitle.displayName = "LearningTitle"

const LearningDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, children, ...props }, ref) => (
        <p ref={ref} className={cn("text-pretty text-gray-800 text-2xl md:text-base leading-relaxed line-clamp-6", className)} {...props}>
            {children}
        </p>
    )
)
LearningDescription.displayName = "LearningDescription"

// --- 3. UPDATED LOGO COMPONENT ---
const LearningLogo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            // Added classes: [&>svg] targets any direct SVG child
            className={cn(
                "hidden w-1/5 md:w-1/3 md:flex flex-col items-center align-middle justify-center h-full p-3 text-gray-400/80",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
)
LearningLogo.displayName = "LearningLogo"

export {
    LearningFolder,
    LearningContent,
    LearningTitle,
    LearningDescription,
    LearningLogo
}