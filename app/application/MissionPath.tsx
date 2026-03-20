'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface Mission {
    id: number;
    status: 'locked' | 'current' | 'completed';
    label: string;
    icon: IconProp;
    action: () => void;
}

export interface MissionPathProps {
    missions?: Mission[];
}

const HorizontalMissionPath: React.FC<MissionPathProps> = ({ missions = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // --- Configuration ---
    const CONTAINER_HEIGHT = 220;
    const AMPLITUDE = 35;
    const FREQUENCY = 4;
    const MAX_CONTENT_WIDTH = 1000;
    const X_PADDING = 80;

    // --- Resize Observer ---
    useEffect(() => {
        if (!containerRef.current) return;
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // --- Calculation Logic ---
    const contentWidth = Math.min(containerWidth, MAX_CONTENT_WIDTH);
    const startOffsetX = (containerWidth - contentWidth) / 2;
    const availableWidth = contentWidth - (X_PADDING * 2);
    const step = missions.length > 1 ? availableWidth / (missions.length - 1) : 0;

    // Helper: คำนวณ Y จาก X
    const calculateY = (x: number) => {
        const relativeX = x - (startOffsetX + X_PADDING);
        const virtualIndex = step > 0 ? relativeX / step : 0;
        const angle = (virtualIndex / FREQUENCY) * (Math.PI * 2);
        return (CONTAINER_HEIGHT / 2) + Math.sin(angle) * AMPLITUDE;
    };

    // Helper: คำนวณ X ของแต่ละ Mission
    const getMissionX = (index: number) => {
        if (missions.length === 1) return containerWidth / 2;
        return startOffsetX + X_PADDING + (index * step);
    };

    // --- 1. หาตำแหน่ง Progress ---
    // หา index ของตัวที่เป็น current หรือตัวสุดท้ายที่ completed
    const currentMissionIndex = missions.findIndex((m) => m.status === 'current');
    // ถ้าไม่มี current เลย (completed หมด) ให้เอาตัวสุดท้าย, ถ้าไม่มีเลยให้เป็น -1
    const activeIndex = currentMissionIndex !== -1
        ? currentMissionIndex
        : (missions.some(m => m.status === 'completed') ? missions.length - 1 : -1);

    // คำนวณจุดตัดของเส้นสี (Width ของ ClipPath)
    // ถ้า activeIndex = -1 (ยังไม่เริ่ม) ให้ width = 0
    // ถ้าเริ่มแล้ว ให้ลากเส้นไปจนถึงจุดกึ่งกลางของปุ่มนั้น
    const progressWidth = activeIndex >= 0
        ? (missions.every((m: Mission) => m.status === 'completed') ? '100%' : getMissionX(activeIndex))
        : 0;

    // --- Generate Path ---
    const svgPathData = useMemo(() => {
        if (containerWidth === 0) return '';
        let path = `M 0 ${calculateY(0)}`;
        const resolution = 10;
        for (let x = 0; x <= containerWidth; x += resolution) {
            path += ` L ${x} ${calculateY(x)}`;
        }
        path += ` L ${containerWidth} ${calculateY(containerWidth)}`;
        return path;
    }, [containerWidth, missions.length, startOffsetX, step]);

    return (
        <div
            ref={containerRef}
            className="w-full flex items-center justify-center relative overflow-hidden"
            style={{ height: CONTAINER_HEIGHT }}
        >
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">

                {/* Definition สำหรับการตัดขอบ (Masking) */}
                <defs>
                    <clipPath id="progress-clip">
                        {/* rect นี้จะกำหนดว่าเส้นสีทองจะแสดงถึงไหน */}
                        <rect x="0" y="0" width={progressWidth} height="100%" />
                    </clipPath>
                </defs>

                <path
                    d={svgPathData}
                    stroke="#414a67"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d={svgPathData}
                    stroke="#f4d470"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    clipPath="url(#progress-clip)"
                    className="transition-all duration-1000 ease-in-out"
                />

                {/* เส้นประตกแต่ง (ทับบนสุดจางๆ) */}
                <path
                    d={svgPathData}
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                    className="opacity-30"
                />
            </svg>

            {/* Layer ปุ่ม Mission */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {missions.map((mission, index) => {
                    const x = getMissionX(index);
                    const y = calculateY(x);

                    return (
                        <div
                            key={mission.id}
                            className="absolute flex flex-row justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                            style={{ left: x, top: y }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.10 }}
                                whileTap={{ scale: 0.98 }}
                                className={`cursor-pointer w-16 h-16 rounded-full flex items-center justify-center shadow-lg font-bold text-lg z-10 border-4
                  ${
                                    mission.status === 'completed' ? 'bg-amber-500 text-white border-amber-500' :
                                        mission.status === 'current' ? 'bg-white text-amber-500 border-amber-500' :
                                            'bg-gray-100 text-gray-400 border-gray-300'
                                }
                `}
                                onClick={mission.action}
                                disabled={mission.status === 'locked'}
                            >

                                <FontAwesomeIcon className="text-2xl" icon={mission.status === 'completed' ? faCheck : mission.icon}/>
                            </motion.button>
                            <div className="absolute text-center pt-1 bottom-[-37px] whitespace-nowrap">
                                <div className="text-sm font-bold">{mission.label}</div>
                                <div className="text-xs text-[#9dabb9]">{mission.status === 'completed' ? 'เสร็จสิ้น' : 'ยังไม่เสร็จสิ้น'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const VerticalMissionPath: React.FC<MissionPathProps> = ({ missions = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const ITEM_SPACING = 140;
    const Y_PADDING = 100;
    const AMPLITUDE = 35;
    const FREQUENCY = 0.015;

    const totalHeight = (Math.max(missions.length - 1, 0) * ITEM_SPACING) + (Y_PADDING * 2);

    useEffect(() => {
        if (!containerRef.current) return;
        const updateWidth = () => {
            if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const calculateX = (y: number) => {
        const centerX = containerWidth / 2;
        const relativeY = y - Y_PADDING;
        const angle = relativeY * FREQUENCY;
        return centerX + Math.sin(angle) * AMPLITUDE;
    };

    const getMissionY = (index: number) => {
        return Y_PADDING + (index * ITEM_SPACING);
    };

    const currentMissionIndex = missions.findIndex((m) => m.status === 'current');
    const activeIndex = currentMissionIndex !== -1
        ? currentMissionIndex
        : (missions.some(m => m.status === 'completed') ? missions.length - 1 : -1);

    const progressHeight = activeIndex >= 0
        ? (missions.every((m) => m.status === 'completed') ? totalHeight : getMissionY(activeIndex))
        : 0;

    const svgPathData = useMemo(() => {
        if (containerWidth === 0) return '';
        let path = `M ${calculateX(0)} 0`;
        const resolution = 5;
        for (let y = 0; y <= totalHeight; y += resolution) {
            path += ` L ${calculateX(y)} ${y}`;
        }
        path += ` L ${calculateX(totalHeight)} ${totalHeight}`;
        return path;
    }, [containerWidth, totalHeight]);

    return (
        <div ref={containerRef} className="w-full relative overflow-hidden" style={{ height: totalHeight }}>
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <defs>
                    <clipPath id="progress-clip-vertical">
                        <rect x="0" y="0" width="100%" height={progressHeight} />
                    </clipPath>
                </defs>
                {/* ใช้สีเดียวกับแนวนอน (#414a67) */}
                <path d={svgPathData} stroke="#414a67" strokeWidth="12" fill="none" strokeLinecap="round" />
                {/* ใช้สีเดียวกับแนวนอน (#f4d470) */}
                <path d={svgPathData} stroke="#f4d470" strokeWidth="12" fill="none" strokeLinecap="round" clipPath="url(#progress-clip-vertical)" className="transition-all duration-1000 ease-in-out" />
                <path d={svgPathData} stroke="white" strokeWidth="2" fill="none" strokeDasharray="10 10" strokeLinecap="round" className="opacity-30" />
            </svg>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {missions.map((mission, index) => {
                    const y = getMissionY(index);
                    const x = calculateX(y);
                    const isLeaningLeft = x < (containerWidth / 2);

                    return (
                        <div key={mission.id} className="absolute flex items-center justify-center pointer-events-auto" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
                            <motion.button
                                whileHover={{ scale: 1.10 }} whileTap={{ scale: 0.90 }}
                                // ใช้ Class Style เดียวกับแนวนอนเป๊ะๆ (ขนาด w-16 h-16)
                                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg font-bold text-lg z-10 border-4 relative ${
                                    mission.status === 'completed' ? 'bg-amber-500 text-white border-amber-500' :
                                        mission.status === 'current' ? 'bg-white text-amber-500 border-amber-500' :
                                            'bg-gray-100 text-gray-400 border-gray-300'
                                }`}
                                onClick={mission.action} disabled={mission.status === 'locked'}
                            >
                                <FontAwesomeIcon className="text-2xl" icon={mission.status === 'completed' ? faCheck : mission.icon}/>
                            </motion.button>

                            {/* Text Box: วางสลับซ้ายขวาตามแนวคลื่น เพื่อไม่ให้ตกขอบ */}
                            <div className={`absolute top-0 flex flex-col justify-center h-16 w-32 ${isLeaningLeft ? 'left-[4.5rem] text-left' : 'right-[4.5rem] text-right'}`}>
                                <div className="text-sm font-bold text-white leading-tight">{mission.label}</div>
                                <div className="text-xs text-[#9dabb9] mt-1">{mission.status === 'completed' ? 'เสร็จสิ้น' : 'ยังไม่เสร็จสิ้น'}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export {VerticalMissionPath, HorizontalMissionPath };