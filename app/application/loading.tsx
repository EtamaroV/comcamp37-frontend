"use client"

import Image from "next/image";
import { motion } from "motion/react";
import {Variants} from "motion";

export default function LoadingScreen() {
    // Animation สำหรับตัวโลโก้: เด้งขึ้นลง + บีบอัด (Squash & Stretch)
    const bounceVariants:Variants = {
        initial: {
            y: 0,
            scaleY: 1,
            scaleX: 1
        },
        animate: {
            y: [-10, 0, -10], // ลอยขึ้นลง
            scaleY: [1.05, 0.9, 1.05], // ยืดตอนลอย หดตอนลงพื้น
            scaleX: [0.95, 1.1, 0.95], // บีบตอนลอย ขยายตอนลงพื้น
            transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse" as const, // แก้ Type ให้ตรงกับ Motion
                ease: "easeInOut"
            }
        }
    };

    // Animation สำหรับเงา: ขยายและจางลงเมื่อโลโก้ลอยขึ้น
    const shadowVariants:Variants = {
        initial: {
            scale: 1,
            opacity: 0.5
        },
        animate: {
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut"
            }
        }
    };

    // Animation สำหรับจุด 3 จุด (...) ให้เด้งเรียงกัน
    const dotVariants:Variants = {
        initial: { y: 0 },
        animate: {
            y: -10,
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeOut"
            }
        }
    };

    const containerVariants:Variants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        },
        exit: { opacity: 0 }
    };

    return (
        <div className='fixed w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent z-50'>
            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center justify-center relative"
            >
                {/* Logo Section */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <div

                        className="relative z-10 w-full h-full"
                    >
                        <Image
                            src="/Comcamp-Logo.png" // ใช้รูปเดิมเพื่อให้ Theme ตรงกัน
                            alt="Loading Logo"
                            width={160}
                            height={160}
                            className="object-contain drop-shadow-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div className="mt-8 flex flex-col items-center">
                    <motion.h2
                        className="text-xl md:text-2xl font-bold text-white/90 font-noto-sans-thai tracking-wide flex items-baseline gap-1"
                    >
                        กำลังโหลดข้อมูล
                        {/* Dots Animation */}
                        <div className="flex gap-1 ml-1">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    variants={dotVariants}
                                    // Override transition เพื่อให้จุดเด้งไม่พร้อมกัน (Wave effect)
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeOut",
                                        delay: i * 0.15
                                    }}
                                    className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block"
                                />
                            ))}
                        </div>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-sm text-white/50 font-light mt-2 font-(family-name:Roboto)"
                    >
                        อดทนรอหน่อยนะ
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}