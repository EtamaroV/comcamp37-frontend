"use client"

import Image from "next/image";
import { motion } from "motion/react";
import { FootTrailColor } from "@/components/landing/FootTrail";
import {Variants} from "motion";
import React from "react";

function ConditionSection() {
    // 1. Container ควบคุมจังหวะการโผล่ของกล่องเงื่อนไข
    const containerVariants:Variants = {
        visible: {
            transition: {
                staggerChildren: 0.3, // แต่ละกล่องห่างกัน 0.3 วินาที
            }
        }
    };

    // 2. ท่า "ไถลมาเบรก" (Siding Entrance)
    // กล่องเลขคี่ (1, 3) ไถลจากซ้าย | กล่องเลขคู่ (2, 4) ไถลจากขวา
    const slideInLeft:Variants = {
        hidden: { opacity: 0, x: -100, rotate: -2 },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: { type: "spring", bounce: 0.4, duration: 1 }
        }
    };

    const slideInRight:Variants = {
        hidden: { opacity: 0, x: 100, rotate: 2 },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: { type: "spring", bounce: 0.4, duration: 1 }
        }
    };

    // 3. ท่าเด้งของรูปภาพ (Pop Up)
    const imagePop:Variants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.2 }
        }
    };

    return (
        <motion.div
            className='w-full min-h-screen bg-theme-primary-darken relative flex flex-col justify-end items-center'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <div className="overflow-clip top-0 flex flex-col justify-center align-middle items-center w-full max-w-[1600px] h-full p-3 md:p-20 z-10 gap-5">

                <motion.div
                    variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="font-zootopia text-5xl max-w-[1600px] w-full mb-10 hidden md:block"
                >
                    Condition
                </motion.div>

                {/* Mobile Title */}
                <motion.div
                    variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                    className="font-zootopia text-5xl md:hidden flex-row flex items-center justify-center gap-3 w-full"
                >
                    <div className="h-1.5 w-full flex-1 bg-linear-to-l from-white to-transparent"></div>
                    <div>Condition</div>
                    <div className="h-1.5 w-full flex-1 bg-linear-to-r from-white to-transparent"></div>
                </motion.div>

                {/* --- Condition Card 1 --- */}
                <motion.div variants={slideInLeft} className="md:h-[180px] w-full xl:w-[75%] backdrop-blur-sm rounded-4xl flex flex-col md:flex-row align-middle items-center self-center md:self-start lg:w-full bg-gradient-to-b from-[#1F456E]/30 to-[#1F456E]/20 border border-white/20 shadow-xl">
                    <motion.div variants={imagePop} className="md:w-[320px] relative">
                        <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Conditions/Condition_1.png`} alt="" width={600} height={320} className="object-cover p-[10px] rounded-4xl" unoptimized/>
                    </motion.div>
                    <div className="text-center text-pretty flex-1 font-semibold text-xl p-5 text-white space-x-1.5">
                        <span>น้อง ๆ ที่กำลังศึกษาอยู่ชั้นมัธยมศึกษาปีที่ 4 - 5</span>
                        <span className="inline-block whitespace-nowrap">
                            (ปีการศึกษา 2568)
                        </span>
                        <span className="inline-block whitespace-nowrap">หรือเทียบเท่า</span>
                        <span className="inline-block whitespace-nowrap">
                            โดยมี GPAX
                        </span>
                        <span className="inline-block">
                            และผลการเรียนเฉลี่ยรายวิชา<span className="inline-block whitespace-nowrap">วิทย์ คณิต อังกฤษ ไม่ต่ำกว่า 3.00</span>
                        </span>
                    </div>
                </motion.div>

                {/* --- Condition Card 2 (Right Side) --- */}
                <motion.div variants={slideInRight} className="md:h-[180px] w-full xl:w-[75%] backdrop-blur-sm rounded-4xl flex flex-col md:flex-row align-middle items-center self-center xl:self-end lg:w-full bg-gradient-to-b from-[#151E3D]/30 to-[#151E3D]/20 border border-white/20 shadow-xl">
                    <div className="text-center flex-1 font-semibold text-xl p-5 order-2 md:order-1 text-white text-pretty">สามารถเข้าพักได้ในระยะเวลาและสถานที่ที่กำหนด<br/>ตลอดโครงการ</div>
                    <motion.div variants={imagePop} className="md:w-[320px] relative order-1 md:order-2">
                        <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Conditions/Condition_2.png`} alt="" width={600} height={320} className="object-cover p-[10px] rounded-4xl" unoptimized/>
                    </motion.div>
                </motion.div>

                {/* --- Condition Card 3 --- */}
                <motion.div variants={slideInLeft} className="md:h-[180px] w-full xl:w-[75%] backdrop-blur-sm rounded-4xl flex flex-col md:flex-row align-middle items-center self-center md:self-start xl:mx-30 lg:w-full bg-gradient-to-b from-[#151E3D]/30 to-[#151E3D]/20 border border-white/20 shadow-xl">
                    <motion.div variants={imagePop} className="md:w-[320px] relative">
                        <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Conditions/Condition_3.png`} alt="" width={600} height={320} className="object-cover p-[10px] rounded-4xl" unoptimized/>
                    </motion.div>
                    <div className="text-center flex-1 font-semibold text-xl p-5 text-white text-pretty">มีความสนใจในด้านคอมพิวเตอร์และภาควิชาวิศวกรรมคอมพิวเตอร์<br/>โดยไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรม</div>
                </motion.div>

                {/* --- Condition Card 4 (Right Side) --- */}
                <motion.div variants={slideInRight} className="md:h-[180px] w-full xl:w-[75%] backdrop-blur-sm rounded-4xl flex flex-col md:flex-row align-middle items-center self-center xl:self-end xl:mx-30 lg:w-full bg-gradient-to-b from-[#4C3B33]/30 to-[#4C3B33]/20 border border-white/20 shadow-xl">
                    <div className="text-center flex-1 font-semibold text-xl p-5 order-2 md:order-1 text-white text-pretty">ผู้ปกครองอนุญาตและยินยอมให้นักเรียนเข้าร่วมโครงการ</div>
                    <motion.div variants={imagePop} className="md:w-[320px] relative order-1 md:order-2">
                        <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Conditions/Condition_4.png`} alt="" width={600} height={320} className="object-cover p-[10px] rounded-4xl" unoptimized/>
                    </motion.div>
                </motion.div>

            </div>
            <div className="absolute w-full">
                <FootTrailColor/>
            </div>
        </motion.div>
    )
}
export default ConditionSection