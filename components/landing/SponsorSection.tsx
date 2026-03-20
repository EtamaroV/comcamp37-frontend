import Image from 'next/image';

interface SponsorItem {
    name: string;
    logo: string;
    height: number;
}

const sponsors:SponsorItem[] = [
    { name: "บริษัท แคมป์ฮับ จำกัด", logo: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/sponsors/CAMPHUB.png`, height: 160 },
    { name: "บริษัท เอ็ม.วาย.พี เอ็นจิเนียริ่ง จำกัด", logo: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/sponsors/MYP Engineering.png`, height: 100 },
    { name: "บริษัท ทองไทยอีเล็คทริค จำกัด", logo: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/sponsors/Thong Thai Elaectric.png`, height: 100 },
    { name: "SpaceDragon", logo: `${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/sponsors/Space Dragon.jpg`, height: 60 },
];

const SectionTitle = ({ title, idPrefix }:{title: string, idPrefix:string}) => (
    <div className="flex flex-row items-center justify-center gap-10 w-full max-w-[1600px]">
        <svg className="hidden md:block flex-1" width="500" height="5" viewBox="0 0 500 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M500 2.5H0" stroke={`url(#paint_left_${idPrefix})`} strokeWidth="5" />
            <defs>
                <linearGradient id={`paint_left_${idPrefix}`} x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
            </defs>
        </svg>

        <div className="font-zootopia text-4xl md:text-5xl whitespace-nowrap">
            {title}
        </div>

        <svg className="hidden md:block flex-1" width="500" height="5" viewBox="0 0 500 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M500 2.5H0" stroke={`url(#paint_right_${idPrefix})`} strokeWidth="5" />
            <defs>
                <linearGradient id={`paint_right_${idPrefix}`} x1="0" y1="3" x2="500" y2="3" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const LogoCard = ({ children, className = "", sponsorName = "" }:{children:React.ReactNode, className:string, sponsorName:string}) => (
    <div className={`
    select-none
        group
        bg-white flex justify-center items-center relative
        shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),_0_8px_10px_-6px_rgba(0,0,0,0.2),_inset_0_0_5px_0_rgba(0,0,0,0.5)]
        ${className}
    `}>
        <div className="absolute top-0 left-0 w-full h-full z-12"></div>
        {children}
        <div className="absolute bottom-0 px-5 py-1 z-11 text-black opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity text-xs md:text-base">{sponsorName}</div>
    </div>
);

const SponsorRow = ({ items }:{items:SponsorItem[]}) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-10 md:px-15 w-full">
            {items.map((sponsor) => (
                <LogoCard
                    key={sponsor.name}
                    sponsorName={sponsor.name}
                    className="px-8 py-5 sm:px-12 sm:py-8 rounded-4xl sm:rounded-[3rem] shrink grow basis-auto"
                >
                    <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        unoptimized
                        style={{ height: `${sponsor.height}px` }}
                        className="w-auto relative z-10 object-contain"
                    />
                </LogoCard>
            ))}
        </div>
    );
};

function SponsorSection() {
    const sponsors160:SponsorItem[] = sponsors.filter(s => s.height === 160);
    const sponsors100:SponsorItem[] = sponsors.filter(s => s.height === 100);
    const sponsors60:SponsorItem[] = sponsors.filter(s => s.height === 60);

    return (
        <section className="flex flex-col md:min-h-screen items-center justify-center gap-y-50 py-25 mx-3">

            {/* ---------------- ORGANIZER SECTION ---------------- */}
            <div className="w-full max-w-[1600px] flex flex-col gap-y-10 mb-10">
                <SectionTitle title="Organizer" idPrefix="org" />

                <div className="flex flex-row justify-center">
                    <LogoCard className="px-12 py-8 rounded-[3rem]" sponsorName="">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/Landing/Kmutt_CPE.png`}
                            alt="KMUTT | CPE"
                            height={429}
                            width={450}
                            unoptimized
                            className="relative z-10 drop-shadow-sm"
                        />
                    </LogoCard>
                </div>
            </div>

            {/* ---------------- SPONSORS SECTION ---------------- */}
            <div className="w-full max-w-[1600px] flex flex-col gap-y-10">
                <SectionTitle title="Sponsored By" idPrefix="spon" />

                <div className="flex flex-col gap-y-10 w-full">
                    <SponsorRow items={sponsors160} />
                    <SponsorRow items={sponsors100} />
                    <SponsorRow items={sponsors60} />
                </div>
            </div>

        </section>
    );
}

export default SponsorSection;