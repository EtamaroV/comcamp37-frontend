"use client"

import Image from "next/image";
import { motion } from "motion/react";
import {Variants} from "motion";
import ThaiWordBreaker from "@/components/ui/ThaiWordBreaker";

function AboutSection() {
    // 1. Container สำหรับคุมจังหวะการโผล่ (Stagger)
    const containerVariants:Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    // 2. ท่าเด้งแบบการ์ตูน (Pop Up + Spring)
    const cartoonPop:Variants = {
        hidden: { opacity: 0, scale: 0.5, rotate: -5 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 15, // ยิ่งน้อยยิ่งเด้งนาน
            },
        },
    };

    // 3. ท่าสไลด์แบบนุ่มนิ่ม (Slide + Bounce)
    const elasticSlide:Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                bounce: 0.5,
                duration: 0.8
            }
        }
    };


    return (
        <motion.div
            className="min-h-screen flex flex-col md:flex-row justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="flex flex-col md:flex-row w-full max-w-[1600px] justify-evenly">
                <div className="w-full h-screen flex flex-col items-start justify-center align-middle gap-15 z-10 md:max-w-180 p-5 md:p-10 lg:p-20">

                    {/* หัวข้อสไลด์เข้ามาแบบเด้งๆ */}
                    <motion.div variants={cartoonPop} className="font-zootopia text-5xl hidden md:block text-white [text-shadow:4px_4px_5_rgba(0,0,0,0.3)]">
                        About
                    </motion.div>

                    <motion.div variants={cartoonPop} className="font-zootopia text-5xl md:hidden flex-row flex items-center justify-center gap-3 w-full">
                        <div className="h-1.5 w-full flex-1 bg-linear-to-l from-white to-transparent"></div>
                        <div>About</div>
                        <div className="h-1.5 w-full flex-1 bg-linear-to-r from-white to-transparent"></div>
                    </motion.div>

                    {/* รูปภาพฝั่ง Mobile: เด้งออกมาแล้วลอยดึ๋งๆ */}
                    <motion.div
                        variants={cartoonPop}
                        className="w-full max-w-80 mx-auto lg:mx-0 p-5 lg:hidden"
                    >
                        <div>
                            <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Callcenter.png`} alt="" width={800} height={800} unoptimized />
                        </div>
                    </motion.div>

                    {/* ข้อความค่อยๆ เด้งตามมา */}
                    <motion.p variants={elasticSlide} className="text-pretty text-white font-medium text-lg text-center lg:text-left">
                        <strong>ComCamp </strong><ThaiWordBreaker text="คือ โครงการฝึกอบรมเชิงปฏิบัติการคอมพิวเตอร์เบื้องต้น จัดโดยภาควิชาวิศวกรรมคอมพิวเตอร์ มจธ. โดยภายในค่าย น้อง ๆ จะได้เรียนรู้พื้นฐานด้านคอมพิวเตอร์ผ่านกิจกรรมอันสนุกที่หลากหลาย พร้อมกับการแนะแนวทางการศึกษาต่อในสายวิศวกรรมคอมพิวเตอร์ เปิดโลกมุมมองใหม่ ๆ ผ่านการเรียนรู้ลงมือปฏิบัติและสร้างแรงบันดาลใจ ให้ค้นพบตัวเองและรู้จักโลกของ วิศวกรรมคอมพิวเตอร์มากยิ่งขึ้น"/>
                    </motion.p>
                </div>

                {/* รูปภาพฝั่ง Desktop: เด้งจากเล็กไปใหญ่ + ลอย Loop */}
                <div className="w-[40%] h-screen flex-col items-center justify-center align-middle gap-3 z-10 max-w-180 hidden lg:flex">
                    <motion.div variants={cartoonPop} className="w-full p-10 lg:p-20">
                        <div>
                            <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Callcenter.png`} alt="" width={800} height={800} unoptimized />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
export default AboutSection;