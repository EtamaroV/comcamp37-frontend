"use client"

import Image from "next/image";
import { motion } from "motion/react";
import FolderSwitcher from "@/components/landing/LearningSwitcher";
import {Variants} from "motion";

function LearningSection() {
    // 1. Variants สำหรับหัวข้อ (เด้งออกมาแบบ Pop)
    const titleVariants:Variants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -2 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { type: "spring", stiffness: 200, damping: 12 }
        }
    };

    // 2. Variants สำหรับแถบสี (รูดออกมาจากซ้าย)
    const barVariants:Variants = {
        hidden: { width: 0, opacity: 0 },
        visible: {
            width: "100%",
            opacity: 1,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    // 3. Variants สำหรับตัว FolderSwitcher (ค่อยๆ ขยายจากล่างขึ้นบน)
    const contentVariants:Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", bounce: 0.4, duration: 1 }
        }
    };

    return (
        <motion.div
            className="flex flex-col w-full align-middle justify-center items-center overflow-hidden bg-theme-primary-darken"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* --- Mobile Title --- */}
            <div

                className="font-zootopia text-5xl md:hidden flex-row flex items-center justify-center gap-3 w-full py-5 bg-theme-primary z-10"
            >
                <motion.div variants={titleVariants} className="h-1.5 w-full flex-1 bg-linear-to-l from-white to-transparent"></motion.div>
                <motion.div className="text-center" variants={titleVariants}>
                    What you<br/>will learn
                </motion.div>
                <motion.div variants={titleVariants} className="h-1.5 w-full flex-1 bg-linear-to-r from-white to-transparent"></motion.div>
            </div>

            <div className="md:mt-0 -mt-13 flex flex-row w-full items-end">

                <div
                    className="absolute bg-theme-primary self-start w-full h-[46px] origin-left z-10 mix-blend-lighten"
                ></div>

                <div
                    className="hidden md:block bg-theme-primary self-start flex-1 h-[46px] origin-left z-8 drop-shadow-[0_6px_6px_rgba(0,0,0,0.4)]"
                ></div>

                <div className="flex flex-row max-w-[1600px] w-full relative z-9">

                    <div
                        className="hidden md:block flex-3 w-full h-[46px] self-start bg-theme-primary z-1 drop-shadow-[0_8px_6px_rgba(0,0,0,0.4)]"
                    ></div>

                    <div
                        className="flex-5 relative drop-shadow-[0_8px_6px_rgba(0,0,0,0.4)] z-2"
                    >
                        <div
                            className="absolute ml-[20%] md:ml-0 -mt-2 md:mt-0 inset-0 w-full h-full bg-theme-primary"
                            style={{
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50px 100%, 0 calc(100% - 50px))'
                            }}
                        ></div>

                        <div className="block md:hidden w-dvw h-26">

                        </div>
                        <div className="hidden md:block font-zootopia text-5xl text-center px-20 py-6 whitespace-nowrap relative z-30">
                            What you will learn
                        </div>
                    </div>

                    <div className="flex-6 md:hidden"></div>
                </div>

                <div className="hidden md:block flex-1 bg-theme-primary h-[96px] z-20 relative">
                    <div className="absolute w-full -ml-5 bg-theme-primary h-[96px] z-11"></div>
                    <div className="w-full bg-theme-primary h-[96px] z-10 drop-shadow-[0_6px_6px_rgba(0,0,0,0.4)]"></div>
                </div>
            </div>

            {/* --- เนื้อหาด้านล่าง (Switcher) --- */}
            <motion.div variants={contentVariants} className="w-full">
                <FolderSwitcher/>
            </motion.div>
        </motion.div>
    )
}

export default LearningSection;