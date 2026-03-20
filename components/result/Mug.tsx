"use client"
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function Mug() {
    return (
        <div className="relative -rotate-[5.78deg] w-[560px] h-[624px] overflow-clip drop-shadow-[18px_42px_4px_rgba(0,0,0,0.25)]">

            <div className="absolute w-[511.104px] h-[511.104px] left-[19.464px] top-[16.273px] bg-[#969696] rounded-full"></div>

            <div className="absolute w-[102.734px] h-[167.966px] left-[376.868px] top-[485.334px] bg-[#989898] rounded-[11px] origin-top-left -rotate-[37deg]"></div>

            <div className="absolute w-[102.734px] h-[222.47px] left-[338.48px] top-[445.383px] bg-[#D9D9D9] rounded-[11px] origin-top-left -rotate-[37deg]"></div>

            <div className="absolute left-0 top-0 w-full h-full bg-[#969696] [clip-path:path('M513.394_274.187C513.394_406.211_406.229_513.237_274.034_513.237C141.838_513.237_34.6729_406.211_34.6729_274.187C215.096_529.454_268.469_377.756_400.664_377.756C532.86_377.756_513.394_142.163_513.394_274.187Z')]"></div>

            <div className="absolute w-[511.104px] h-[511.104px] left-0 top-0 bg-[#D9D9D9] rounded-full"></div>

            <div className="absolute w-[479px] h-[479px] left-[19.262px] top-[18.262px] bg-[#BDBDBD] rounded-full"></div>

            <div className="absolute w-[454.6px] h-[454.6px] left-[38.525px] top-[37.525px] bg-[#844B18] rounded-full overflow-hidden">
                <motion.div
                    className="w-full h-full relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 3,
                        duration: 3,
                        ease: "easeOut"
                    }}
                >
                    <Image src="https://storage.comcamp.io/web-assets/result/goose-shadow.webp" height={0} width={0} sizes="100%" alt="" unoptimized
                        className="absolute w-[80%] -bottom-[40px] -left-[5px]"
                    />
                </motion.div>
            </div>
        </div>
    )
}