"use client"

import type {Metadata} from "next";
import "../globals.css";
import {Navbar} from "@/components/ui/navbar";
import {Footer} from "@/components/ui/footer";
import {UserProvider, useUser} from "@/contexts/UserContext";
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import LoadingScreen from "@/app/application/loading";
import {StudentProvider, useStudent} from "@/contexts/StudentContext";
import { motion } from 'motion/react'
import {Button} from "@/components/ui/button";
import * as React from "react";

function AuthGate({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const { isLoadingApp } = useStudent();

    const isPublicRoute = pathname === "/signin" || pathname === "/privacy";

    useEffect(() => {
        if (!isLoading && !user && !isPublicRoute) {
            router.replace('/signin');
        }
    }, [user, isLoading, router, pathname, isPublicRoute]);

    if ((isLoading || isLoadingApp) && !isPublicRoute) {
        return <LoadingScreen/>;
    }

    return <>{children}</>;
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    return (
        <UserProvider>
            <StudentProvider>
                <AuthGate>
                    <NoApp/>
                    {children}
                    <div className="w-full text-center py-3 md:px-20 text-sm leading-5 text-slate-500 flex flex-col gap-x-3 gap-y-10">
                        <span className="self-center">©2026 ComCamp37. All rights reserved.<br className="md:hidden"/> Made with 🧡 by CPE39.</span>
                    </div>
                </AuthGate>
            </StudentProvider>
        </UserProvider>
    );
}

function NoApp() {
    const { hasApplication, createApplication } = useStudent();
    const { user, signOut } = useUser();
    const router = useRouter();
    if (!hasApplication) {
    return (
        <div className="w-full h-full fixed top-0 bg-theme-primary-darken/90 backdrop-blur-xl z-50 flex flex-col justify-center items-center">

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-10 max-w-md w-full flex flex-col items-center text-center space-y-6"
            >
                {/* User Profile Image */}
                <div className="relative">
                    <div className="w-28 h-28 rounded-full">
                        <img
                            src={user?.image || ""}
                            alt="User"
                            className="w-full h-full rounded-full object-cover border-4 border-slate-800"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">ยินดีต้อนรับ<br/>{user?.name}</h2>
                    <p className="text-slate-400 text-base">
                        {user?.email}
                    </p>

                    <p className="text-slate-400 text-sm">
                        หากไม่ใช่คุณ <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => {signOut(); router.push('/signin')}}>ออกจากระบบ</span>
                    </p>
                </div>

                <div className="space-y-2 w-full">
                    <Button
                        onClick={() => createApplication()}
                        className="cursor-pointer relative w-full px-8 py-6 font-bold rounded-xl bg-primary hover:bg-primary/90 focus:ring-offset-slate-900"
                    >
                        สร้างใบสมัคร
                    </Button>
                </div>
            </motion.div>
        </div>
    )} else {
        return (<></>)
    }
}

