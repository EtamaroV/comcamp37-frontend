"use client"

import Image from "next/image";
import * as React from "react";

const sponsors = [
    { name: "บริษัท เอ็ม.วาย.พี. เอ็นจิเนียริง จำกัด", logo: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/sponsors/MYP Engineering.png`, height: 100 },
    { name: "บริษัท ทองไทยอีเล็คทริค จำกัด", logo: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/sponsors/Thong Thai Elaectric.png`, height: 100 },
]

function SponsorSection() {
    return (
        <div className='flex flex-col md:min-h-screen justify-center items-center align-middle gap-y-50 py-25 mx-3'>
            <div className="w-full max-w-[1600px] flex flex-col gap-y-10">
                <div className="flex flex-row align-middle justify-center items-center gap-10">
                    <svg width="500" height="5" viewBox="0 0 500 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M500 2.5H0" stroke="url(#paint0_linear_590_593)" strokeWidth="5"/>
                        <defs>
                            <linearGradient id="paint0_linear_590_593" x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" stopOpacity="0"/>
                                <stop offset="1" stopColor="white"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="font-zootopia text-5xl">Organizer</div>

                    <svg width="500" height="5" viewBox="0 0 500 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M500 2.5H0" stroke="url(#paint0_linear_590_594)" strokeWidth="5"/>
                        <defs>
                            <linearGradient id="paint0_linear_590_594" x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>

                </div>

                <div className="flex flex-row justify-center">
                    <div className="px-12 py-8 rounded-[3rem]

                        bg-white

                        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),_0_8px_10px_-6px_rgba(0,0,0,0.2),_inset_0_0_5px_0_rgba(0,0,0,0.5)]
                        " >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Kmutt_CPE.png`}
                            alt="KMUTT | CPE"
                            height={429}
                            width={450}
                            unoptimized
                            // เพิ่ม class ให้รูปภาพเล็กน้อย เพื่อให้แสงเงาของ Container เด่นขึ้น (Optional)
                            className="relative z-10 drop-shadow-sm"
                        />
                    </div>
                </div>

            </div>

            <div className="w-full max-w-[1600px] flex flex-col gap-y-20">
                <div className="flex flex-row align-middle justify-center items-center gap-10">
                    <svg width="500" height="5" viewBox="0 0 500 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M500 2.5H0" stroke="url(#paint0_linear_590_593)" strokeWidth="5"/>
                        <defs>
                            <linearGradient id="paint0_linear_590_593" x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" stopOpacity="0"/>
                                <stop offset="1" stopColor="white"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="font-zootopia text-4xl md:text-5xl whitespace-nowrap">Sponsored By</div>

                    <svg width="500" height="5" viewBox="0 0 500 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M500 2.5H0" stroke="url(#paint0_linear_590_594)" strokeWidth="5"/>
                        <defs>
                            <linearGradient id="paint0_linear_590_594" x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"/>
                                <stop offset="1" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                    </svg>

                </div>

                <div className="flex flex-wrap flex-row items-center gap-10 md:mx-10">
                    { sponsors.map((sponsor) => (
                        <div key={sponsor.name} className="sm:px-12 sm:py-8 px-8 py-5 rounded-4xl sm:rounded-[3rem] shrink grow-1 basis-auto flex flex-row justify-center

                        bg-white

                        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),_0_8px_10px_-6px_rgba(0,0,0,0.2),_inset_0_0_5px_0_rgba(0,0,0,0.5)]
                        " >
                            <Image
                                src={sponsor.logo}
                                alt={sponsor.name}
                                width={0}
                                height={0}
                                sizes="100vw"
                                unoptimized
                                className={`w-auto h-[${sponsor.height}px] relative z-10 object-contain`}
                            />
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}
export default SponsorSection