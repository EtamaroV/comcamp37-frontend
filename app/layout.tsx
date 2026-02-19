import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono, Noto_Sans_Thai, Bai_Jamjuree, Roboto} from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import {Navbar} from "@/components/ui/navbar";
import {Footer} from "@/components/ui/footer";
import { Toaster } from "@/components/ui/sonner"
import MicrosoftClarity from "@/app/metrics/MicrosoftClarity";
import {UserProvider} from "@/contexts/UserContext";

export const runtime = 'edge';

const zootopiaFont = localFont({
    variable: "--font-zootopia",
    src: './zootopia-font.woff2',
})

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-roboto",
});

const notoSansThai = Noto_Sans_Thai({
    subsets: ["thai", "latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-noto-sans-thai",
});

const baiJamjuree = Bai_Jamjuree({
    subsets: ["thai", "latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
    variable: "--font-bai_jamjuree",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    // This helps content flow behind the status bar if needed
    viewportFit: 'cover',
}

export const metadata: Metadata = {
    title: {
        template: '%s | ComCamp 37',
        default: 'ComCamp 37',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
    },
    description: "กลับมาอีกครั้ง ! กับค่าย “ComCamp 37” จัดโดยพี่ ๆ วิศวะคอมฯ บางมด ขอเชิญน้อง ๆ มาร่วมกอบกู้เมืองที่ทุกคนมีความฝัน ใครพร้อมแล้ว ? สมัครเลย ! งานนี้ ได้ทั้งความรู้ ความสนุก ฟรีตลอดค่าย",
    openGraph: {
        title: 'ComCamp 37 ค่ายวิศวะคอมพิวเตอร์ มจธ.',
        description: 'กลับมาอีกครั้ง ! กับค่าย “ComCamp 37” จัดโดยพี่ ๆ วิศวะคอมฯ บางมด ขอเชิญน้อง ๆ มาร่วมกอบกู้เมืองที่ทุกคนมีความฝัน ใครพร้อมแล้ว ? สมัครเลย ! งานนี้ ได้ทั้งความรู้ ความสนุก ฟรีตลอดค่าย',
        url: 'https://comcamp.io',
        siteName: 'ComCamp 37',
        images: [
            {
                url: 'https://storage.comcamp.io/web-assets/og.png',
                width: 1200,
                height: 630,
                alt: 'ComCamp 37',
            },
        ],
        locale: 'th_TH',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ComCamp 37',
        description: 'ค่ายคอมพิวเตอร์วิศวะบางมด กลับมาแล้ว!',
        images: ['https://storage.comcamp.io/web-assets/og.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${notoSansThai.variable} ${zootopiaFont.variable} ${baiJamjuree.variable} ${roboto.variable} font-bai_jamjuree antialiased bg-theme-primary dark`} /* bg-[#2D364E] #232C40 */
        >
        <UserProvider>
            { process.env.NEXT_PUBLIC_IS_COMINGSOON  == 'false' && (<Navbar/>)}

        {children}
        </UserProvider>
        <MicrosoftClarity/>
        <Toaster />
        </body>
        </html>
    );
}
