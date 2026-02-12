"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "motion/react";
//import {useUser} from "@/contexts/UserContext";

function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    //const {signOut} = useUser();

    const isLandingPage = pathname === '/';

    const isApplicationPage = pathname.startsWith('/application');

    const handleSignOut = async () => {
        console.log("Signing out...");
        //signOut()
        router.push('/');
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <motion.div
            initial={{ y: -100, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`p-3 top-0 w-full ${isLandingPage ? 'sticky md:fixed' : 'sticky'} flex flex-col items-center font-zootopia z-[1000]`}
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
                <div className="h-full flex-1 flex flex-row pt-[2px]">
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
                </div>

                {/* Middle Links - ONLY visible on Landing Page */}
                <div className={`${!isApplicationPage ? 'lg:flex hidden' : 'hidden'} flex-2 flex-row gap-x-5 justify-between font-bold xl:text-lg pt-1`}>
                    {['About', 'Learning', 'Condition', 'Timeline', 'Faq', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            className="cursor-pointer text-white transition-all duration-300 hover:[text-shadow:_0_0_20px_rgba(235,139,81,0.7)]"
                            href={`/#${item.toLowerCase()}`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="flex-1 flex-row justify-end h-full pr-2 py-2 xl:text-lg hidden lg:flex">
                    {isApplicationPage ? (
                        // --- STATE 1: Application Page (Sign Out) ---
                        <button
                            onClick={handleSignOut}
                            className="cursor-pointer font-bold px-6 xl:px-8 pt-1 bg-transparent transition-all duration-400 border border-white h-full rounded-2xl hover:bg-red-500 hover:border-red-500 hover:text-white"
                        >
                            Sign Out
                        </button>
                    ) : (
                        // --- STATE 2: Landing Page / Other (Coming Soon) ---
                        <button className="cursor-pointer font-bold px-6 xl:px-8 pt-1 bg-transparent transition-all duration-400 border border-white h-full rounded-2xl hover:bg-white hover:text-black">
                            Coming Soon
                        </button>
                    )}
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
                <div className="flex flex-col items-center gap-y-6 py-8 font-bold text-xl text-white">
                    {/* Only show scroll links if on Landing Page */}
                    {!isApplicationPage && (
                        <>
                            {['About', 'Learning', 'Condition', 'Timeline', 'Faq', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    className="hover:text-orange-300 transition-colors"
                                    href={`/#${item.toLowerCase()}`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </>
                    )}

                    {/* Mobile CTA Logic */}
                    {isApplicationPage ? (
                        <button
                            onClick={() => { handleSignOut(); closeMenu(); }}
                            className="cursor-pointer font-bold px-10 py-3 mt-2 bg-white/10 border border-white rounded-2xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all duration-300"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <button className="cursor-pointer font-bold px-10 py-3 mt-2 bg-white/10 border border-white rounded-2xl hover:bg-white hover:text-black transition-all duration-300">
                            Coming Soon
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export {Navbar}