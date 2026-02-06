"use client"

import Image from "next/image";
import { motion } from "motion/react"

import { authClient } from "@/lib/auth-client";
import {Variants} from "motion";

const loginWithGoogle = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/application"
    })
}
export default function SignInPage() {
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
    const bgVariants:Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 0,
            scale: 1,
            transition: { duration: 1 }
        }
    };
    return (
        <div className='flex flex-col items-center justify-center h-dvh px-15 overflow-hidden'>
            <motion.div
                className='flex flex-col w-full max-w-[340px] items-center text-center mx-5'
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >

                <div className="w-full h-auto relative mb-8 select-none">
                    <motion.div variants={bgVariants} className="relative z-0">
                        <Image
                            className="drop-shadow-2xl"
                            src="/Comcamp-Logo.png"
                            alt="Comcamp 37 Logo"
                            width={800}
                            height={800}
                            priority
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(19%_20%,26%_46%,0%_50%,0%_25%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(39%_19%,47%_35%,41%_43%,28%_45%,20%_31%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(74%_11%,72%_44%,44%_44%,48%_26%,43%_9%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(11%_48%,33%_45%,35%_77%,10%_77%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(34%_53%,49%_53%,49%_73%,35%_73%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(55%_52%,69%_52%,74%_73%,49%_73%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(74%_52%,92%_54%,91%_67%,80%_68%,79%_85%,58%_85%,55%_77%,74%_77%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                    <motion.div variants={itemVariants} className="absolute top-0 left-0 w-full h-full z-10">
                        <Image className="w-full h-full [clip-path:polygon(74%_24%,72%_41%,88%_53%,100%_55%,100%_37%,88%_26%)]" src="/Comcamp-Logo.png" alt="Logo Part" width={800} height={800} priority />
                    </motion.div>
                </div>

                <motion.button
                    variants={itemVariants}
                    onClick={loginWithGoogle}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-white w-full flex items-center justify-center gap-3 h-13 md:h-15 px-4 rounded-xl shadow-lg cursor-pointer"
                >
                    <Image src="/google.svg" width={22} height={22} alt="Google Logo"/>
                    <span className="text-gray-700 font-medium md:text-lg md:leading-15.5 leading-13.5 tracking-tight opacity-80 font-noto-sans-thai h-full">
                        Continue with Google
                    </span>
                </motion.button>

                <motion.p
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: -50,
                            scale: 1
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.8,
                            },
                        },
                    }}
                    className="mt-6 text-sm leading-relaxed text-white/60 font-light font-(family-name:Roboto)"
                >
                    เมื่อเข้าสู่ระบบ ถือว่าคุณได้ยอมรับ <br className="sm:hidden"/>
                    <a href="/privacy" className="text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors">
                        นโยบายความเป็นส่วนตัว
                    </a> ของเราแล้ว
                </motion.p>

            </motion.div>
        </div>
    );
}