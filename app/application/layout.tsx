"use client"

import type {Metadata} from "next";
import "../globals.css";
import {Navbar} from "@/components/ui/navbar";
import {Footer} from "@/components/ui/footer";
import {UserProvider, useUser} from "@/contexts/UserContext";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import LoadingScreen from "@/app/application/loading";
import {StudentProvider, useStudent} from "@/contexts/StudentContext";
import { motion } from 'motion/react'
import {Button} from "@/components/ui/button";
import * as React from "react";
import {REGIS_EXPIRED_DATE, useCountdown} from "@/app/application/countdown";

function AuthGate({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useUser();
    const { studentStatus } = useStudent();
    const { } = useStudent();
    const router = useRouter();
    const pathname = usePathname();
    const { isLoadingApp, ApplicationStatus } = useStudent();

    const { isExpired } = useCountdown(REGIS_EXPIRED_DATE);

    const isPublicRoute = pathname === "/signin" || pathname === "/privacy";

    useEffect(() => {
        if (!isLoading && !user && !isPublicRoute) {
            router.replace('/signin');
        }
    }, [user, isLoading, router, pathname, isPublicRoute]);

    useEffect(() => {

        const restrictedPaths = [
            "/application/file",
            "/application/question-academic",
            "/application/question-aptitude",
            "/application/question-regis",
            "/application/register"
        ];

        if ((isExpired && restrictedPaths.includes(pathname)) || (ApplicationStatus?.std_application_submit && restrictedPaths.includes(pathname))) {
            router.replace('/application');
            return;
        }

        if (!isLoading && (studentStatus?.std_status_info_done == false) && !(pathname == "/application/register")) {
            router.replace('/application/register');
        }

    }, [studentStatus, pathname]);

    if ((isLoading || isLoadingApp) && !isPublicRoute) {
        return <LoadingScreen/>;
    }

    return <>{children}</>;
}

function GetAppId() {
    const [ appid, setappid ] = useState<string>("");
    const { applicationId } = useStudent();
    useEffect(() => {
        if (applicationId != null) {
            setappid(applicationId);
        }
    }, [applicationId]);
    return <div className="w-full text-center font-thin text-xs opacity-30 mt-2 text-twilight-indigo-300">{appid}</div>;
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    /*useEffect(() => {
        const appColor = "#001E47";
        const originalAppColor = "#014AAD";
        const originalBodyClasses = ["bg-theme-primary"];
        const appBodyClasses = ["bg-[#001E47]"];

        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        const originalThemeColor = meta.getAttribute('content');
        meta.setAttribute('content', appColor);

        document.body.classList.remove(...originalBodyClasses);
        document.body.classList.add(...appBodyClasses);

        return () => {
            meta?.setAttribute('content', originalAppColor || "");

            document.body.classList.remove(...appBodyClasses);
            document.body.classList.add(...originalBodyClasses);
        };
    }, []);*/
    return (
        <span id="application-root">
        <UserProvider>
            <StudentProvider>
                <AuthGate>
                    <NoApp/>
                    {children}

                    <div className="w-full text-center py-3 md:px-20 text-sm leading-5 text-slate-600 flex flex-col gap-x-3">
                        <span className="mt-2 self-center">©2026 ComCamp37. All rights reserved.<br className="md:hidden"/> Made with 🧡 by CPE39.</span>
                        <GetAppId/>
                    </div>
                </AuthGate>
            </StudentProvider>
        </UserProvider>
        </span>
    );
}

function NoApp() {
    const { hasApplication, createApplication  } = useStudent();
    const { user, signOut } = useUser();
    const router = useRouter();
    if ( !hasApplication ) {
    return (
        <div className="w-full h-full fixed top-0 bg-theme-primary-darken/90 backdrop-blur-xl flex flex-col justify-center items-center z-100">

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-twilight-indigo-800 border border-twilight-indigo-700 shadow-2xl rounded-2xl p-10 max-w-md w-full flex flex-col items-center text-center space-y-6"
            >
                {/* User Profile Image */}
                <div className="relative">
                    <div className="w-28 h-28 rounded-full">
                        <img
                            src={user?.image || ""}
                            alt="User"
                            className="w-full h-full rounded-full object-cover border-4 border-twilight-indigo-800"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">ยินดีต้อนรับ<br/>{user?.name}</h2>
                    <p className="text-twilight-indigo-400 text-base">
                        {user?.email}
                    </p>

                    <p className="text-twilight-indigo-400 text-sm">
                        หากไม่ใช่คุณ <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => {signOut(); router.push('/signin')}}>ออกจากระบบ</span>
                    </p>
                </div>

                <div className="space-y-2 w-full">
                    <Button
                        onClick={() => createApplication()}
                        className="cursor-pointer relative w-full px-8 py-6 font-bold rounded-xl bg-primary hover:bg-primary/90 focus:ring-offset-twilight-indigo-900"
                    >
                        สร้างใบสมัคร
                    </Button>
                </div>
            </motion.div>
        </div>
    )}
}

