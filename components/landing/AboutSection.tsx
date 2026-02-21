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
            className="min-h-screen flex flex-col md:flex-row justify-center relative overflow-x-clip"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >

            <div
                className="hidden md:block absolute -top-70 left-0 w-full h-full md:w-1/2 mask-svg-tl pointer-events-none"
                aria-hidden="true"
            >
                <div className="absolute -inset-[50%] bg-dots -rotate-[15deg]" />
            </div>

            <div
                className="hidden md:block  absolute -bottom-30 right-0 w-full h-full md:w-1/2 mask-svg-br pointer-events-none"
                aria-hidden="true"
            >
                <div className="absolute -inset-[50%] bg-dots -rotate-[15deg]" />
            </div>

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
                        <div className="relative flex flex-col justify-center items-center">
                            <svg className="absolute h-[140%]" width="916" height="944" viewBox="0 0 916 944" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M797.863 824.115C742.986 855.496 689.238 880.488 645.244 891.9C627.148 896.594 615.95 890.562 610.397 886.09C604.844 881.618 604.844 876.714 605.334 872.227C607.279 854.419 625.512 825.304 674.88 779.227C709.671 746.757 741.412 739.926 743.907 737.95C763.696 722.272 651.703 738.886 610.382 746.836C605.906 747.697 606.804 743.938 610.739 739.481C614.673 735.023 621.533 729.139 645.155 712.379C668.778 695.618 708.955 668.16 733.573 650.091C758.19 632.023 766.03 624.178 770.068 618.666C774.107 613.153 774.107 610.211 771.657 608.696C765.274 604.747 734.761 615.025 651.094 649.958C591.046 675.029 498.832 723.136 440.585 749.822C363.044 785.348 331.737 789.435 316.904 790.431C310.905 790.833 307.951 789.465 306.927 787.489C305.902 785.512 306.882 782.57 405.381 726.628C503.88 670.685 699.869 561.832 798.383 505.265C896.897 448.699 891.997 447.718 755.711 485.459C619.424 523.199 351.9 599.691 210.655 639.096C69.4095 678.501 62.5499 678.501 57.5463 676.049C52.5426 673.598 49.6028 668.694 50.0482 663.226C50.4937 657.759 54.4134 651.875 61.3324 644.921C68.2514 637.967 78.0508 630.122 183.053 579.008C288.055 527.895 487.964 433.751 604.666 376.917C721.368 320.083 748.806 303.412 767.351 291.391C785.896 279.37 794.715 272.506 795.339 267.989C795.962 263.472 788.123 261.51 695.89 292.372C603.656 323.233 427.267 386.976 326.11 422.265C224.953 457.554 204.374 462.458 191.323 464.493C178.272 466.529 173.372 465.548 172.808 462.591C171.206 454.196 190.002 442.815 278.345 399.071C356.106 360.567 503.88 295.507 586.463 256.25C669.045 216.994 682.764 207.188 685.912 200.665C689.06 194.142 681.22 191.2 668.852 190.665C656.484 190.13 639.825 192.091 611.154 199.476C582.484 206.861 542.306 219.609 474.571 248.732C406.836 277.855 312.762 322.965 266.749 342.772C220.736 362.578 225.636 355.714 275.197 322.267C324.759 288.82 418.833 229 481.015 185.925C543.197 142.85 570.635 118.333 585.26 103.252C599.885 88.1705 600.865 83.2671 598.92 81.2315C594.134 76.2224 569.388 87.0709 500.035 113.638C448.024 133.562 363.066 169.625 313.757 189.283C254.123 213.057 237.663 214.914 231.219 213.443C226.9 212.457 240.513 200.115 270.996 177.961C333.12 132.809 383.05 101.068 390.014 90.6667C409.178 62.043 292.272 101.989 265.413 99.5224C259.463 98.976 252.599 99.0172 257.885 95.0946C278.58 79.7362 317.602 64.4562 343.363 48.6021C303.319 58.275 220.855 84.1586 208.992 83.178C203.988 82.1973 201.048 80.236 198.02 78.2152" stroke="#1C3071" strokeWidth="100" strokeLinecap="round"/>
                            </svg>
                            <div className="z-1">
                                <Image className="absolute w-[32%]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/aboutClaw.png`} alt="" width={130} height={0} unoptimized />
                                <Image className="absolute right-0 w-[32%]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/aboutSpring.png`} alt="" width={130} height={0} unoptimized />
                                <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Callcenter.png`} alt="" width={800} height={800} unoptimized />
                                <svg className="absolute -right-[15%] -bottom-[25%] w-[60%]" viewBox="0 0 316 316" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_f_955_1369)">
                                        <rect width="200" height="200" transform="translate(24.6992 110.7) rotate(-25.4675)" fill="#EB8B51"/>
                                    </g>
                                    <defs>
                                        <filter id="filter0_f_955_1369" x="-0.000782013" y="-4.95911e-05" width="315.966" height="315.966" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                            <feGaussianBlur stdDeviation="12.35" result="effect1_foregroundBlur_955_1369"/>
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
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
                        <div className="relative flex flex-col justify-center items-center">
                            <svg className="absolute h-[140%]" width="916" height="944" viewBox="0 0 916 944" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M797.863 824.115C742.986 855.496 689.238 880.488 645.244 891.9C627.148 896.594 615.95 890.562 610.397 886.09C604.844 881.618 604.844 876.714 605.334 872.227C607.279 854.419 625.512 825.304 674.88 779.227C709.671 746.757 741.412 739.926 743.907 737.95C763.696 722.272 651.703 738.886 610.382 746.836C605.906 747.697 606.804 743.938 610.739 739.481C614.673 735.023 621.533 729.139 645.155 712.379C668.778 695.618 708.955 668.16 733.573 650.091C758.19 632.023 766.03 624.178 770.068 618.666C774.107 613.153 774.107 610.211 771.657 608.696C765.274 604.747 734.761 615.025 651.094 649.958C591.046 675.029 498.832 723.136 440.585 749.822C363.044 785.348 331.737 789.435 316.904 790.431C310.905 790.833 307.951 789.465 306.927 787.489C305.902 785.512 306.882 782.57 405.381 726.628C503.88 670.685 699.869 561.832 798.383 505.265C896.897 448.699 891.997 447.718 755.711 485.459C619.424 523.199 351.9 599.691 210.655 639.096C69.4095 678.501 62.5499 678.501 57.5463 676.049C52.5426 673.598 49.6028 668.694 50.0482 663.226C50.4937 657.759 54.4134 651.875 61.3324 644.921C68.2514 637.967 78.0508 630.122 183.053 579.008C288.055 527.895 487.964 433.751 604.666 376.917C721.368 320.083 748.806 303.412 767.351 291.391C785.896 279.37 794.715 272.506 795.339 267.989C795.962 263.472 788.123 261.51 695.89 292.372C603.656 323.233 427.267 386.976 326.11 422.265C224.953 457.554 204.374 462.458 191.323 464.493C178.272 466.529 173.372 465.548 172.808 462.591C171.206 454.196 190.002 442.815 278.345 399.071C356.106 360.567 503.88 295.507 586.463 256.25C669.045 216.994 682.764 207.188 685.912 200.665C689.06 194.142 681.22 191.2 668.852 190.665C656.484 190.13 639.825 192.091 611.154 199.476C582.484 206.861 542.306 219.609 474.571 248.732C406.836 277.855 312.762 322.965 266.749 342.772C220.736 362.578 225.636 355.714 275.197 322.267C324.759 288.82 418.833 229 481.015 185.925C543.197 142.85 570.635 118.333 585.26 103.252C599.885 88.1705 600.865 83.2671 598.92 81.2315C594.134 76.2224 569.388 87.0709 500.035 113.638C448.024 133.562 363.066 169.625 313.757 189.283C254.123 213.057 237.663 214.914 231.219 213.443C226.9 212.457 240.513 200.115 270.996 177.961C333.12 132.809 383.05 101.068 390.014 90.6667C409.178 62.043 292.272 101.989 265.413 99.5224C259.463 98.976 252.599 99.0172 257.885 95.0946C278.58 79.7362 317.602 64.4562 343.363 48.6021C303.319 58.275 220.855 84.1586 208.992 83.178C203.988 82.1973 201.048 80.236 198.02 78.2152" stroke="#1C3071" strokeWidth="100" strokeLinecap="round"/>
                            </svg>
                            <div className="z-1">
                                <Image className="absolute w-[32%]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/aboutClaw.png`} alt="" width={130} height={0} unoptimized />
                                <Image className="absolute right-0 w-[32%]" src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/aboutSpring.png`} alt="" width={130} height={0} unoptimized />
                                <Image src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Callcenter.png`} alt="" width={800} height={800} unoptimized />
                                <svg className="absolute -right-[15%] -bottom-[25%] w-[60%]" viewBox="0 0 316 316" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_f_955_1369)">
                                        <rect width="200" height="200" transform="translate(24.6992 110.7) rotate(-25.4675)" fill="#EB8B51"/>
                                    </g>
                                    <defs>
                                        <filter id="filter0_f_955_1369" x="-0.000782013" y="-4.95911e-05" width="315.966" height="315.966" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                            <feGaussianBlur stdDeviation="12.35" result="effect1_foregroundBlur_955_1369"/>
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
export default AboutSection;