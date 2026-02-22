"use client"

import { motion } from "motion/react";
import * as React from "react";
import { Variants } from "motion";

const TIMELINE_DATA = [
    {
        id: 1,
        title: "เปิดรับสมัคร",
        dateDisplay: "23 กุมภาพันธ์ - 10 มีนาคม 2569",
        startDate: process.env.NEXT_PUBLIC_TIME_START_REGIS,
        endDate: process.env.NEXT_PUBLIC_TIME_END_REGIS,
    },
    {
        id: 2,
        title: "ประกาศผล",
        dateDisplay: "21 มีนาคม 2569",
        startDate: "2026-03-21",
        endDate: "2026-03-21",
    },
    {
        id: 3,
        title: "ยืนยันสิทธิ์",
        dateDisplay: "21 - 22 มีนาคม 2569",
        startDate: "2026-03-21",
        endDate: "2026-03-22",
    },
    {
        id: 4,
        title: "วันค่าย",
        dateDisplay: "8 - 12 เมษายน 2569",
        startDate: "2026-04-08",
        endDate: "2026-04-12",
    },
];

function TimelineSection() {
    const [progress, setProgress] = React.useState(0);
    const [currentMilestone, setCurrentMilestone] = React.useState(0);

    // Desktop Refs
    const checkpointsRef = React.useRef<(HTMLDivElement | null)[]>([]);
    const progressBarRef = React.useRef<HTMLDivElement>(null);

    // Mobile Refs (เพิ่มใหม่)
    const mobileCheckpointsRef = React.useRef<(HTMLDivElement | null)[]>([]);
    const mobileProgressBarRef = React.useRef<HTMLDivElement>(null);

    // --- Animation Variants ---
    const headerLineVariants: Variants = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: (index: number) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.5,
                damping: 12,
                stiffness: 120,
                delay: index * 0.15
            }
        })
    };

    // --- Logic คำนวณ Progress ---
    React.useEffect(() => {
        const today = new Date();
        //today.setHours(0, 0, 0, 0);

        let milestoneIndex = -1;
        let milestoneProgress = 0;

        const firstMilestoneStart = new Date(TIMELINE_DATA[0].startDate);
        //firstMilestoneStart.setHours(0, 0, 0, 0);

        if (today < firstMilestoneStart) {
            setCurrentMilestone(-1);
            setProgress(0);
            return;
        }

        for (let i = 0; i < TIMELINE_DATA.length; i++) {
            const milestoneStart = new Date(TIMELINE_DATA[i].startDate);
            milestoneStart.setHours(0, 0, 0, 0);
            const milestoneEnd = new Date(TIMELINE_DATA[i].endDate);
            //milestoneEnd.setHours(23, 59, 59, 999);

            if (today >= milestoneStart && today <= milestoneEnd) {
                milestoneIndex = i;
                const totalDuration = milestoneEnd.getTime() - milestoneStart.getTime();
                const elapsed = today.getTime() - milestoneStart.getTime();
                milestoneProgress = totalDuration > 0 ? elapsed / totalDuration : 1;
                break;
            } else if (today > milestoneEnd) {
                milestoneIndex = i;
                milestoneProgress = 1;
            } else {
                break;
            }
        }

        if (milestoneIndex >= TIMELINE_DATA.length - 1 && milestoneProgress === 1) {
            milestoneIndex = TIMELINE_DATA.length - 1;
        }

        setCurrentMilestone(milestoneIndex);

        const calculateProgress = () => {
            const isMobile = window.innerWidth < 1024;

            const activeBarRef = isMobile ? mobileProgressBarRef : progressBarRef;
            const activeCheckpoints = isMobile ? mobileCheckpointsRef.current : checkpointsRef.current;

            if (!activeBarRef.current || activeCheckpoints.length === 0) return;

            const barRect = activeBarRef.current.getBoundingClientRect();

            const barStart = isMobile ? barRect.top : barRect.left;
            const barSize = isMobile ? barRect.height : barRect.width;

            if (barSize === 0) return;

            const currentCheckpoint = activeCheckpoints[milestoneIndex];
            if (!currentCheckpoint) {
                setProgress(0);
                return;
            }

            const currentRect = currentCheckpoint.getBoundingClientRect();

            const currentCenter = isMobile
                ? (currentRect.top + currentRect.height / 2) - barStart
                : (currentRect.left + currentRect.width / 2) - barStart;

            if (milestoneProgress === 1) {
                const progressPercent = (currentCenter / barSize) * 100;
                setProgress(Math.min(progressPercent, 100));
            } else {
                const nextCheckpoint = activeCheckpoints[milestoneIndex + 1];
                if (!nextCheckpoint) {
                    const progressPercent = (currentCenter / barSize) * 100;
                    setProgress(Math.min(progressPercent, 100));
                    return;
                }

                const nextRect = nextCheckpoint.getBoundingClientRect();
                const nextCenter = isMobile
                    ? (nextRect.top + nextRect.height / 2) - barStart
                    : (nextRect.left + nextRect.width / 2) - barStart;

                const distance = nextCenter - currentCenter;
                const progressPixels = currentCenter + (distance * milestoneProgress);
                const progressPercent = (progressPixels / barSize) * 100;

                setProgress(Math.min(progressPercent, 100));
            }
        };

        const timer = setTimeout(calculateProgress, 100);
        window.addEventListener('resize', calculateProgress);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateProgress);
        };
    }, [currentMilestone]);

    return (
        <motion.div
            className='w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="w-full max-w-7xl flex flex-col gap-8 md:gap-12">

                {/* --- Header Section --- */}
                <div className="flex flex-row items-center justify-center gap-4 md:gap-8 lg:gap-10 overflow-hidden">
                    <motion.svg
                        variants={headerLineVariants}
                        className="hidden md:block w-32 md:w-64 lg:w-96 xl:w-[500px] origin-right"
                        height="5"
                        viewBox="0 0 500 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M500 2.5H0" stroke="url(#paint0_linear_590_593)" strokeWidth="5"/>
                        <defs>
                            <linearGradient id="paint0_linear_590_593" x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" stopOpacity="0"/>
                                <stop offset="1" stopColor="white"/>
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    <motion.h2
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white whitespace-nowrap font-zootopia hidden md:block"
                    >
                        Timeline
                    </motion.h2>

                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="font-zootopia text-5xl md:hidden flex-row flex items-center justify-center gap-3 w-full"
                    >
                        <div className="h-1.5 w-full flex-1 bg-linear-to-l from-white to-transparent"></div>
                        <div>Timeline</div>
                        <div className="h-1.5 w-full flex-1 bg-linear-to-r from-white to-transparent"></div>
                    </motion.div>

                    <motion.svg
                        variants={headerLineVariants}
                        className="hidden md:block w-32 md:w-64 lg:w-96 xl:w-[500px] origin-left"
                        height="5"
                        viewBox="0 0 500 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M500 2.5H0" stroke="url(#paint0_linear_590_594)" strokeWidth="5"/>
                        <defs>
                            <linearGradient id="paint0_linear_590_594" x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                    </motion.svg>
                </div>

                {/* --- Desktop Timeline --- */}
                <div className="hidden lg:flex flex-row justify-center gap-6 xl:gap-12 relative mt-10">

                    {/* Progress Bar Background */}
                    <div
                        ref={progressBarRef}
                        className="absolute xl:bottom-6.5 bottom-4.5 left-0 right-0 h-3 bg-black/40 rounded-full shadow-inner overflow-hidden border border-white/5"
                    >
                        {/* Progress Fill */}
                        <motion.div
                            className="h-full bg-theme-secondary"
                            style={{ boxShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                        />
                    </div>

                    {TIMELINE_DATA.map((item, index) => {
                        const milestoneEnd = new Date(item.endDate);
                        milestoneEnd.setHours(23, 59, 59, 999);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isCompleted = today > milestoneEnd;
                        const isCurrent = index === currentMilestone && !isCompleted;

                        return (
                            <motion.div
                                key={item.id}
                                custom={index}
                                variants={cardVariants}
                                className="flex flex-col gap-6 items-center z-10"
                            >
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.05 }}
                                    className={`
                                        text-xl xl:text-2xl text-white text-center font-bold w-48 xl:w-60 py-6 xl:py-8 rounded-3xl backdrop-blur-md 
                                        bg-gradient-to-b from-white/10 to-white/5 border border-white/20 
                                        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)] transition-colors duration-300
                                    `}
                                >
                                    {item.title}
                                </motion.div>

                                <div className="text-center text-white/90 text-base xl:text-lg font-semibold px-2">
                                    {item.dateDisplay}
                                </div>

                                <div
                                    ref={(el) => { checkpointsRef.current[index] = el; }}
                                    className={`
                                        border-4 w-12 h-12 xl:w-16 xl:h-16 rounded-full mt-4 flex items-center justify-center shadow-2xl z-20 
                                        transition-all duration-500
                                        ${isCompleted
                                        ? 'border-theme-secondary bg-theme-secondary'
                                        : isCurrent
                                            ? 'bg-theme-secondary border-white ring-4 ring-theme-secondary/30'
                                            : 'border-gray-600 bg-gray-800'
                                    }
                                    `}
                                >
                                    {isCompleted ? (
                                        <motion.svg
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                        </motion.svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                                            <path d="M14.143 42.4262C12.1903 40.4736 12.1903 37.3078 14.143 35.3552L35.26 14.2381C37.2396 12.2586 40.4512 12.3484 42.4307 14.328C44.3045 16.2017 44.3942 19.246 42.5205 21.1198L21.214 42.4262C19.2614 44.3789 16.0956 44.3789 14.143 42.4262Z" fill="white"/>
                                            <path d="M42.4262 42.4265C40.4735 44.3791 37.3077 44.3791 35.3551 42.4265L14.238 21.3094C12.2585 19.3299 12.3483 16.1182 14.3279 14.1387C16.2016 12.2649 19.2459 12.1752 21.1197 14.0489L42.4262 35.3554C44.3788 37.308 44.3788 40.4738 42.4262 42.4265Z" fill="white"/>
                                        </svg>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* --- Mobile/Tablet Timeline (Vertical) --- */}
                <div className="lg:hidden flex flex-col gap-8 mt-8 relative px-4">
                    {/* ผูก Ref ของ Mobile Progress Bar ที่นี่ */}
                    <div
                        ref={mobileProgressBarRef}
                        className="absolute left-9.5 -top-6 w-1.5 h-full bg-black/40 rounded-full overflow-hidden"
                    >
                        <motion.div
                            className="w-full bg-theme-secondary shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            initial={{ height: 0 }}
                            animate={{ height: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                        />
                    </div>

                    {TIMELINE_DATA.map((item, index) => {
                        const milestoneEnd = new Date(item.endDate);
                        milestoneEnd.setHours(23, 59, 59, 999);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isCompleted = today > milestoneEnd;
                        const isCurrent = index === currentMilestone && !isCompleted;

                        return (
                            <motion.div
                                key={item.id}
                                custom={index}
                                variants={{
                                    hidden: { opacity: 0, x: -50 },
                                    visible: (i: number) => ({
                                        opacity: 1, x: 0,
                                        transition: { type: "spring", bounce: 0.4, delay: i * 0.15 }
                                    })
                                }}
                                className="flex flex-row gap-6 items-start z-10"
                            >
                                {/* ผูก Ref ของ Mobile Checkpoints ที่นี่ */}
                                <div
                                    ref={(el) => { mobileCheckpointsRef.current[index] = el; }}
                                    className={`
                                        border-4 w-12 h-12 sm:w-14 mt-1 sm:h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 
                                        transition-all duration-500
                                        ${isCompleted
                                        ? 'border-theme-secondary bg-theme-secondary'
                                        : isCurrent
                                            ? 'border-white bg-theme-secondary ring-4 ring-theme-secondary/30'
                                            : 'border-gray-600 bg-gray-800'
                                    }
                                    `}
                                >
                                    {isCompleted ? (
                                        <motion.svg
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        >
                                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </motion.svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 57 57" fill="none" className="opacity-50">
                                            <path d="M14.143 42.4262C12.1903 40.4736 12.1903 37.3078 14.143 35.3552L35.26 14.2381C37.2396 12.2586 40.4512 12.3484 42.4307 14.328C44.3045 16.2017 44.3942 19.246 42.5205 21.1198L21.214 42.4262C19.2614 44.3789 16.0956 44.3789 14.143 42.4262Z" fill="white"/>
                                            <path d="M42.4262 42.4265C40.4735 44.3791 37.3077 44.3791 35.3551 42.4265L14.238 21.3094C12.2585 19.3299 12.3483 16.1182 14.3279 14.1387C16.2016 12.2649 19.2459 12.1752 21.1197 14.0489L42.4262 35.3554C44.3788 37.308 44.3788 40.4738 42.4262 42.4265Z" fill="white"/>
                                        </svg>
                                    )}
                                </div>

                                {/* Content */}
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col gap-3 flex-1"
                                >
                                    <div className={`
                                        text-xl sm:text-2xl text-white font-bold py-4 px-6 rounded-2xl backdrop-blur-sm 
                                        bg-gradient-to-b from-white/10 to-white/5 border border-white/20 
                                        shadow-lg transition-all duration-300
                                    `}>
                                        {item.title}
                                    </div>
                                    <div className="text-white/80 text-base sm:text-lg font-semibold ml-2">
                                        {item.dateDisplay}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default TimelineSection;