"use client"

import InfiniteCarousel from "@/components/landing/InfiniteCarousel";
import Image from "next/image";
import {motion} from "motion/react";
import {Variants} from "motion";
import ThaiWordBreaker from "@/components/ui/ThaiWordBreaker";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRotateRight} from "@fortawesome/free-solid-svg-icons";
import {router} from "next/client";
import {useRouter} from "next/navigation";

const itemVariants:Variants = {
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
            bounce: 0.5,
            duration: 0.8,
        },
    },
};

const bgVariant:Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 2.0,
        },
    },
};

function HeroSection() {
    const router = useRouter();
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isRegistrationEnd, setIsRegistrationEnd] = useState(false);

    const REGISTRATION_START_DATE = new Date(process.env.NEXT_PUBLIC_TIME_START_REGIS || "2026-02-23T00:00:00+07:00");
    const REGISTRATION_END_DATE = new Date(process.env.NEXT_PUBLIC_TIME_END_REGIS || "2026-03-10T23:59:59+07:00");

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            setIsRegistrationOpen(now >= REGISTRATION_START_DATE);
            setIsRegistrationEnd(now >= REGISTRATION_END_DATE);
        };

        checkTime();

        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center -mt-8 md:mt-0">
            <div className="w-full flex flex-col items-center justify-center align-middle gap-3 z-10 md:pt-20">
                <div className="w-full max-w-[280px] md:max-w-[340px] drop-shadow-xl drop-shadow-black/70 relative">
                    <div className="relative w-full opacity-0">
                        <Image
                            className="drop-shadow-2xl"
                            src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`}
                            alt="Comcamp 37 Logo"
                            width={800}
                            height={800}
                            unoptimized
                        />
                    </div>

                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full z-10">
                        <Image className="w-full [clip-path:polygon(19%_20%,26%_46%,0%_50%,0%_25%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full z-10">
                        <Image className="w-full [clip-path:polygon(39%_19%,47%_35%,41%_43%,28%_45%,20%_31%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full  z-10">
                        <Image className="w-full  [clip-path:polygon(74%_11%,72%_44%,44%_44%,48%_26%,43%_9%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full  z-10">
                        <Image className="w-full  [clip-path:polygon(11%_48%,33%_45%,35%_77%,10%_77%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full  z-10">
                        <Image className="w-full  [clip-path:polygon(34%_53%,49%_53%,49%_73%,35%_73%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full  z-10">
                        <Image className="w-full  [clip-path:polygon(55%_52%,69%_52%,74%_73%,49%_73%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full  z-10">
                        <Image className="w-full  [clip-path:polygon(74%_52%,92%_54%,91%_67%,80%_68%,79%_85%,58%_85%,55%_77%,74%_77%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full  z-10">
                        <Image className="w-full  [clip-path:polygon(74%_24%,72%_41%,88%_53%,100%_55%,100%_37%,88%_26%)]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`} alt="Logo Part" width={800} height={800} unoptimized />
                    </motion.div>
                </div>
                <motion.div variants={itemVariants} className="text-center font-medium px-4 md:px-10 py-6 rounded-4xl -mt-6 md:-mt-3 mx-3
                    backdrop-blur-sm

                bg-gradient-to-b from-black/60 to-black/40
                border border-white/20

                shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1),_inset_0_1px_0_0_rgba(0,0,0,0.5),_inset_0_0_20px_0_rgba(0,0,0,0.05)]
                ">
                    <span className="drop-shadow-sm drop-shadow-black text-lg space-x-1">
                        <ThaiWordBreaker text="ขอเชิญน้อง ๆ ที่สนใจด้านคอมพิวเตอร์ ร่วมเปิดประสบการณ์การเรียนรู้กับ"/>
                        <span className="inline-block whitespace-nowrap">ComCamp ครั้งที่ 37</span>
                        <br/>
                        <ThaiWordBreaker text="ค่ายที่จะพาน้อง ๆ มาค้นหาและปลดล็อกศักยภาพด้านวิศวกรรมคอมพิวเตอร์ ผ่านกิจกรรมและเวิร์กชอปที่ทั้งสนุกและได้ความรู้"/><br/>
                        <ThaiWordBreaker text="พร้อมสัมผัสชีวิตนักศึกษาวิศวะคอมฯ อย่างใกล้ชิด กับเพื่อน ๆ และพี่ ๆ CPE"/><br/><br className="block md:hidden"/>
                        <ThaiWordBreaker text="การผจญภัยครั้งใหม่กำลังรออยู่ แล้วพบกันใน ComCamp ครั้งที่ 37"/>
                    </span>
                </motion.div>
                <motion.div variants={itemVariants} className="w-full max-w-[340px]">
                { isRegistrationOpen ? (
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/signin')}
                            className="z-20 group bg-white hover:bg-gray-300 w-full max-w-[340px] flex items-center justify-center h-15 md:h-15 px-4 rounded-xl shadow-lg shadow-black/50 cursor-pointer transition-colors border-none"
                        >
                    <span className="text-black font-bold text-xl md:leading-15.5 leading-13.5 tracking-tight font-(family-name:Roboto) h-full">
                        {isRegistrationEnd ? "เข้าสู่ระบบ" : "สมัครเลย !"}
                    </span>
                        </motion.button>
                    ) :
                    (
                <motion.div
                    className="bg-white w-full max-w-[340px] flex items-center justify-center gap-3 h-15 px-4 rounded-xl shadow-lg shadow-black/50 mb-10"
                >
                    <span className={`text-black font-bold text-xl leading-15.5 tracking-tight font-zootopia h-full`}>
                        Coming Soon
                    </span>
                </motion.div>
                    )
                }</motion.div>
            </div>
            <motion.div variants={bgVariant} className="absolute w-full h-full hidden md:flex flex-col">
                <div className="absolute w-full h-full overflow-y-visible overflow-x-clip z-2 flex justify-center items-center align-middle">
                    <div className="rotate-10 py-20 mt-50 scale-120 overflow-hidden origin-center">
                        <InfiniteCarousel/>
                    </div>
                </div>

                <div className="absolute w-full h-full z-1">
                    <div className="bg-gradient-to-t from-theme-primary-darken to-transparent h-[20%] w-full"></div>
                    <div className="bg-theme-primary-darken h-[95%] w-full"></div>
                    <div className="bg-gradient-to-b from-theme-primary-darken to-transparent h-[20%] w-full"></div>
                </div>
            </motion.div>

            <div className="md:hidden absolute top-0 w-full -mt-15 h-[150dvh] overflow-x-hidden">
                <motion.div variants={bgVariant} className="absolute top-0 w-[1000px] h-full flex md:hidden flex-col">
                    <div className="absolute top-0 bg-gradient-to-b from-theme-primary-darken to-transparent h-[150dvh] w-full"></div>
                    <Image
                        className="object-top"
                        src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/mbBG.webp`}
                        alt=""
                        fill
                        layout="fill"
                        style={{ objectFit: 'contain' }}
                        sizes="100%"
                    />
                </motion.div>
            </div>
        </div>
    )
}
export default HeroSection