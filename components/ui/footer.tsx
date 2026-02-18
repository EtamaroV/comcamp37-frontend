"use client";

import * as React from "react"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookSquare, faInstagram, faTiktok} from "@fortawesome/free-brands-svg-icons";
import { useRef, useEffect, useState } from "react";
import {useInView} from "motion/react";

function Footer() {
    const [isIOS, setIsIOS] = useState(false);

    const router = useRouter();

    const footerRef = useRef(null);
    const isInView = useInView(footerRef, { amount: 0.1 });


    useEffect(() => {
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
        const isIOSDevice = /(iPhone|iPad|iPod|iOS)/i.test(userAgent);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsIOS(isIOSDevice);
    }, []);

    useEffect(() => {
        const metaTheme = document.querySelector('meta[name="theme-color"]');

        const footerColor = '#151E3D';
        const primaryColor = '#1F456E';

        if (!isIOS) {return}

        if (isInView) {
            if (metaTheme) metaTheme.setAttribute('content', footerColor);

            document.body.style.backgroundColor = footerColor;
        } else {
            if (metaTheme) metaTheme.setAttribute('content', primaryColor);

            document.body.style.backgroundColor = primaryColor;
        }

    }, [isInView]);

    return (
        <div className="pt-20 md:pt-0 bg-theme-primary" id={`contact`}>
        <div className='w-full border-t-7 border-theme-secondary flex flex-col justify-center items-center align-middle bg-theme-primary-darken'>
            <div className="w-full max-w-[1600px] bg-theme-primary-darken flex-col flex gap-y-10 md:grid grid-rows-2 grid-cols-2 md:gap-5 pt-10 pb-20 relative p-20">
                <div className="row-span-2 col-span-1 flex flex-col gap-10">
                    <div className="font-zootopia text-4xl">Social Media</div>
                    <div className="text-xl xl:text-2xl flex flex-col gap-3">
                        <a href={`https://www.facebook.com/KMUTTcomcamp/`} target="_blank" className="hover:underline underline-offset-3"><FontAwesomeIcon icon={faFacebookSquare} /> Comcamp KMUTT</a>
                        <a href={`https://www.instagram.com/comcamp.kmutt/`} target="_blank" className="hover:underline underline-offset-3"><FontAwesomeIcon icon={faInstagram} /> @comcamp.kmutt</a>
                        <a href={`https://www.tiktok.com/@comcamp.kmutt`} target="_blank" className="hover:underline underline-offset-3"><FontAwesomeIcon icon={faTiktok} /> @comcamp.kmutt</a>
                    </div>
                </div>
                <div className="row-span-1 col-span-1 flex flex-col gap-5">
                    <div className="font-zootopia text-4xl">Address</div>
                    <div className="pl-2 xl:text-lg">
                        ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์<br/>มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี ชั้น 10 อาคารวิศววัฒนะ<br/>เลขที่ 126 ถ.ประชาอุทิศ แขวงบางมด เขตทุ่งครุ กรุงเทพฯ 10140
                    </div>
                </div>
                <div className="row-span-1 col-span-1 flex flex-col gap-5" ref={footerRef}>
                    <div className="font-zootopia text-4xl">Contact</div>
                    <div className="pl-2 xl:text-lg flex flex-col">
                        <a href="tel:0933707960" className="hover:text-theme-secondary">พี่โดนัท : 093 370 7960</a>
                        <a href="tel:0625941597" className="hover:text-theme-secondary">พี่เกน : 062 594 1597</a>
                        <a href="tel:0935299514" className="hover:text-theme-secondary">พี่กร : 093 529 9514</a>
                        <a href="tel:0982870453" className="hover:text-theme-secondary">พี่ไทม์ : 098 287 0453</a>
                    </div>
                </div>

            </div>

            <div className="w-full max-w-[1600px] bg-theme-primary-darken relative ">
                <div className="h-50 w-50 absolute bottom-0 right-0 hidden md:block">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/gooseNick.png`}
                        alt="Comcamp 37 Logo"
                        fill
                        sizes="auto"
                        unoptimized
                    />
                </div>
                <div className="w-full text-center py-3 md:px-20 text-sm leading-5 text-slate-500 flex flex-col md:flex-row gap-x-3 gap-y-10">
                    <div className="cursor-pointer hover:underline text-base text-white/80 font-medium" onClick={() => {router.push("/privacy")}}>Privacy Policy</div>
                    <div className="border-l-2 border-slate-500 h-auto md:block hidden"></div>
                    <span className="self-center">©2026 ComCamp37. All rights reserved.<br className="md:hidden"/> Made with 🧡 by CPE39.</span>
                </div>
            </div>

        </div>
        </div>
    )
}

export {Footer}
