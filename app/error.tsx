"use client"

import { useEffect } from "react"
import { motion, Variants } from "motion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

export default function ErrorPage({
                                      error,
                                      reset,
                                  }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                bounce: 0.6,
                duration: 0.8,
            },
        },
    };

    return (
        <div className='absolute top-0 w-full flex flex-col items-center justify-center h-dvh px-15 overflow-hidden'>
            <motion.div
                className='z-20 flex flex-col w-full max-w-[340px] items-center text-center mx-5'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* ไอคอนแจ้งเตือน Error */}
                <motion.div variants={itemVariants} className="text-8xl text-red-500 drop-shadow-sm mb-4">
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl font-black text-red-500 drop-shadow-sm mb-2 font-(family-name:Roboto)"
                >
                    Oops!
                </motion.h1>

                <motion.p variants={itemVariants} className="text-white mb-6 font-bold text-xl">
                    แย่แล้ว! เกิดข้อผิดพลาดบางอย่าง 😵‍💫
                </motion.p>

                {/* ปุ่ม Reset จะเรียกฟังก์ชัน reset() ของ Next.js เพื่อลอง render หน้าเดิมอีกครั้ง */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => reset()}
                    className="z-20 group bg-red-500 hover:bg-red-600 w-full flex items-center justify-center gap-3 h-13 md:h-15 px-4 rounded-xl shadow-lg cursor-pointer transition-colors border-none"
                >
                    <FontAwesomeIcon icon={faRotateRight} className="text-white" />

                    <span className="text-white font-bold md:text-lg md:leading-15.5 leading-13.5 tracking-tight font-(family-name:Roboto) h-full">
                        ลองใหม่อีกครั้ง
                    </span>
                </motion.button>

                {/* (Option) เผื่ออยากให้มีปุ่มกลับหน้าแรกคู่กัน */}
                <motion.a
                    variants={itemVariants}
                    href="/"
                    className="mt-4 text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
                >
                    หรือ กลับสู่หน้าหลัก
                </motion.a>

            </motion.div>
        </div>
    );
}