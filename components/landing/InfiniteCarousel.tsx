'use client';

import Marquee from 'react-fast-marquee';

import Image from 'next/image';

const InfiniteCarousel = () => {
    // ตัวอย่างรูปภาพ - คุณสามารถเปลี่ยนเป็นรูปของคุณเองได้
    const photos1 = [
        { id: 1, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel1_1.jpg`, alt: 'Photo 1' },
        { id: 2, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel1_2.jpg`, alt: 'Photo 2' },
        { id: 3, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel1_3.jpg`, alt: 'Photo 3' },
        { id: 4, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel1_4.jpg`, alt: 'Photo 4' },
        { id: 5, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel1_5.jpg`, alt: 'Photo 5' },
    ];

    const photos2 = [
        { id: 1, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel2_1.jpg`, alt: 'Photo 1' },
        { id: 2, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel2_2.jpg`, alt: 'Photo 2' },
        { id: 3, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel2_3.jpg`, alt: 'Photo 3' },
        { id: 4, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel2_4.jpg`, alt: 'Photo 4' },
        { id: 5, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel2_5.jpg`, alt: 'Photo 5' },
        { id: 6, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel2_6.jpg`, alt: 'Photo 6' },
    ];

    const photos3 = [
        { id: 1, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel3_1.jpg`, alt: 'Photo 1' },
        { id: 2, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel3_2.jpg`, alt: 'Photo 2' },
        { id: 3, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel3_3.jpg`, alt: 'Photo 3' },
        { id: 4, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel3_4.jpg`, alt: 'Photo 4' },
        { id: 5, src: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Carousel/Carousel3_5.jpg`, alt: 'Photo 5' },
    ];

    return (
        <>
            <div className="w-full overflow-hidden">
                <svg width="100%" height="31" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="wave-tile" x="0" y="0" width="206" height="62" patternUnits="userSpaceOnUse" viewBox="0 0 206 62" patternTransform="scale(0.5)">
                            {/* ใช้ Path ชุดเดียวจากโค้ดเดิมของคุณ */}
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 55.8H9.785V37.2H19.57V18.6H29.355V24.8H39.3117V49.6H49.0967V37.2H58.8817V12.4H68.6667V55.8H78.4517V31H88.2367V6.2H98.0217V24.8H107.978V37.2H117.763V49.6H127.548V0H137.333V18.6H147.118H156.903V62H166.688V49.6H176.645V43.4H186.43V24.8H196.215V6.2H206V62H196.215H186.43H176.645H166.688H156.903H147.118H137.333H127.548H117.763H107.978H98.0217H88.2367H78.4517H68.6667H58.8817H49.0967H39.3117H29.355H19.57H9.785H0V55.8Z"
                                fill="#014AAD"
                            />
                        </pattern>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#wave-tile)" />
                </svg>
            </div>


        <div className="w-full relative overflow-hidden py-3 border-t-7 border-b-7 border-theme-secondary">
            <div className="absolute w-full h-full flex flex-row justify-between z-30">
                <div className="bg-linear-to-r from-theme-secondary to-transparent to-50% h-full aspect-square absolute"></div>
                <div className="bg-linear-to-l from-theme-secondary to-transparent to-50% h-full aspect-square right-0 absolute"></div>
            </div>
            <div></div>
            <div className="space-y-4">

                <Marquee speed={35} gradient={false} autoFill={true} className="blur-[3px]">
                    {photos1.map((photo, index) => (
                        <div
                            key={`row1-${index}`}
                            className="relative ml-3 h-[200px] w-[300px] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={photo.src}
                                alt=""
                                fill
                                sizes="auto"
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ))}
                </Marquee>

                <Marquee speed={50} gradient={false} autoFill={true} className="blur-[3px]">
                    {photos2.map((photo, index) => (
                        <div
                            key={`row2-${index}`}
                            className="relative ml-3 h-[200px] w-[300px] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={photo.src}
                                alt=""
                                fill
                                sizes="auto"
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ))}
                </Marquee>

                <Marquee speed={35} gradient={false} autoFill={true} className="blur-[3px]">
                    {photos3.map((photo, index) => (
                        <div
                            key={`row3-${index}`}
                            className="relative ml-3 h-[200px] w-[300px] overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={photo.src}
                                alt=""
                                fill
                                sizes="auto"
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </div>
            <div className="w-full overflow-hidden rotate-180">
                <svg width="100%" height="31" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="wave-tile" x="0" y="0" width="206" height="62" patternUnits="userSpaceOnUse" viewBox="0 0 206 62" patternTransform="scale(0.5)">
                            {/* ใช้ Path ชุดเดียวจากโค้ดเดิมของคุณ */}
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 55.8H9.785V37.2H19.57V18.6H29.355V24.8H39.3117V49.6H49.0967V37.2H58.8817V12.4H68.6667V55.8H78.4517V31H88.2367V6.2H98.0217V24.8H107.978V37.2H117.763V49.6H127.548V0H137.333V18.6H147.118H156.903V62H166.688V49.6H176.645V43.4H186.43V24.8H196.215V6.2H206V62H196.215H186.43H176.645H166.688H156.903H147.118H137.333H127.548H117.763H107.978H98.0217H88.2367H78.4517H68.6667H58.8817H49.0967H39.3117H29.355H19.57H9.785H0V55.8Z"
                                fill="#014AAD"
                            />
                        </pattern>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#wave-tile)" />
                </svg>
            </div>
        </>
    );
};

export default InfiniteCarousel;