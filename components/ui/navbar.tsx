"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "motion/react";
import { useUser } from "@/contexts/UserContext";

function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    const { user, signOut } = useUser();

    const REGISTRATION_START_DATE = new Date(process.env.NEXT_PUBLIC_TIME_START_REGIS || "2026-02-23T00:00:00+07:00");

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            setIsRegistrationOpen(now >= REGISTRATION_START_DATE);
        };

        checkTime();

        const timer = setInterval(checkTime, 60000);
        return () => clearInterval(timer);
    }, []);

    const isLandingPage = pathname === '/';
    const isApplicationPage = pathname.startsWith('/application');

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const closeMenu = () => setIsMenuOpen(false);

    const renderCTAButton = (isMobile: boolean) => {
        const baseClass = isMobile
            ? "cursor-pointer font-bold px-10 py-3 mt-2 border border-white rounded-2xl transition-all duration-300 "
            : "cursor-pointer font-bold px-6 xl:px-8 pt-1 bg-transparent transition-all duration-400 border border-white h-full rounded-2xl ";

        if (isApplicationPage) {
            return (
                <button
                    onClick={() => { handleSignOut(); if(isMobile) closeMenu(); }}
                    className={baseClass + (isMobile ? "drop-shadow-black/50 drop-shadow-lg font-bai_jamjuree bg-white/10 hover:bg-white  hover:text-black" : "hover:bg-white hover:text-black drop-shadow-black/50 drop-shadow-lg")}
                >
                    ออกจากระบบ
                </button>
            );
        }

        if (user) {
            return (
                <button
                    onClick={() => { router.push('/application'); if(isMobile) closeMenu(); }}
                    className={baseClass + (isMobile ? "drop-shadow-black/50 drop-shadow-lg font-bai_jamjuree bg-white/10 hover:bg-white hover:text-black" : "hover:bg-white hover:text-black drop-shadow-black/50 drop-shadow-lg")}
                >
                    ใบสมัครของฉัน
                </button>
            );
        }

        if (isRegistrationOpen) {
            return (
                <button
                    onClick={() => { router.push('/signin'); if(isMobile) closeMenu(); }}
                    className={baseClass + (isMobile ? "drop-shadow-black/50 drop-shadow-lg font-bai_jamjuree bg-white/10 hover:bg-white hover:text-black" : "hover:bg-white hover:text-black drop-shadow-black/50 drop-shadow-lg")}
                >
                    สมัครเลย!
                </button>
            );
        }

        return (
            <button className={baseClass + (isMobile ? "drop-shadow-black/50 drop-shadow-lg bg-white/10 opacity-60 cursor-not-allowed font-zootopia" : "opacity-60 cursor-not-allowed font-zootopia drop-shadow-black/50 drop-shadow-lg")} disabled>
                Coming Soon
            </button>
        );
    };

    return (
        <motion.div
            initial={{ y: -100, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`select-none p-3 top-0 w-full ${isLandingPage ? 'sticky md:fixed' : 'sticky'} flex flex-col items-center z-[1000]`}
        >
            <nav className="
                relative z-50
                flex flex-row h-17 w-full max-w-[1671px] justify-between items-center pl-6
                rounded-4xl overflow-hidden
                backdrop-blur-lg
                bg-gradient-to-b from-white/5 to-white/2
                border border-white/20
                shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1),_inset_0_1px_0_0_rgba(255,255,255,0.5),_inset_0_0_20px_0_rgba(255,255,255,0.05)]
            ">
                <div className="h-full flex-1 flex flex-row pt-[2px] gap-x-5">
                    <a className="relative aspect-square cursor-pointer" onClick={() => {
                        router.push('/');
                        closeMenu();
                    }}>
                        <Image
                            className="drop-shadow-lg drop-shadow-black/20"
                            src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Comcamp-Logo.png`}
                            alt="Comcamp 37 Logo"
                            fill
                            sizes="auto"
                            style={{ objectFit: 'contain' }}
                            unoptimized
                        />
                    </a>
                    { isApplicationPage && (
                    <div className="h-full items-center flex flex-row gap-x-5">
                        <div className="border-l border-white/30 h-[70%]"></div>
                        <div onClick={()=>router.push('/application')} className="font-bold text-lg cursor-pointer text-white transition-all duration-300 hover:[text-shadow:_0_0_20px_rgba(235,139,81,1.0)] drop-shadow-black/50 drop-shadow-lg">ใบสมัครของฉัน</div>
                    </div>
                    )}
                </div>

                {/* Middle Links - ONLY visible on Landing Page */}
                <div className={`${!isApplicationPage ? 'lg:flex hidden' : 'hidden'} flex-2 flex-row gap-x-5 justify-between font-bold xl:text-lg pt-1 font-zootopia`}>
                    {['About', 'Learning', 'Condition', 'Timeline', 'Faq', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            className="cursor-pointer text-white transition-all duration-300 hover:[text-shadow:_0_0_20px_rgba(235,139,81,0.7)] drop-shadow-black/50 drop-shadow-lg"
                            href={`/#${item.toLowerCase()}`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="flex-1 flex-row justify-end h-full pr-2 py-2 xl:text-lg hidden lg:flex">
                    {renderCTAButton(false)}
                </div>

                {/* Mobile Burger Button */}
                <div className="lg:hidden mr-5 flex items-center h-full">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="cursor-pointer font-bold bg-transparent transition-all duration-400 w-8 h-8 flex flex-col justify-center gap-y-1.5 z-50"
                    >
                        <span className={`w-8 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-8 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-8 h-0.5 bg-white rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </nav>

            {/* --- Mobile Menu Dropdown --- */}
            <div className={`
                absolute top-22 w-[calc(100%-1.5rem)] max-w-[1671px] overflow-hidden transition-all duration-500 ease-in-out
                rounded-3xl lg:hidden
                backdrop-blur-lg bg-gradient-to-b from-white/10 to-white/5 border border-white/20
                shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_inset_0_1px_0_0_rgba(255,255,255,0.2)]
                ${isMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-5'}
            `}>
                <div className="flex flex-col items-center gap-y-6 py-8 font-bold text-xl text-white font-zootopia">
                    {!isApplicationPage && (
                        <>
                            {['About', 'Learning', 'Condition', 'Timeline', 'Faq', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    className="text-white mix-blend-difference hover:text-orange-300 transition-colors drop-shadow-black/50 drop-shadow-lg"
                                    href={`/#${item.toLowerCase()}`}
                                    onClick={closeMenu}
                                >
                                    {item}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* Mobile CTA Logic */}
                    {renderCTAButton(true)}
                </div>
            </div>
        </motion.div>
    )
}

export {Navbar}