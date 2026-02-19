"use client";

import Image from 'next/image';
import { motion } from "motion/react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faFloppyDisk,
    faFolderOpen,
    faMapLocationDot, faPersonHiking,
    faSignsPost,
    faTents,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {HorizontalMissionPath, VerticalMissionPath, Mission} from "@/app/application/MissionPath";

import { useUser } from "@/contexts/UserContext";

import { useRouter } from "next/navigation";
import {useStudent} from "@/contexts/StudentContext";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Spinner} from "@/components/ui/spinner";

interface TimerStatus {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isUrgent: boolean;
    isExpired: boolean | null;
}

interface CountdownLabelProps {
    status: TimerStatus;
}

interface MissionOverlayProps {
    isExpired: boolean | null | undefined;
}

const useCountdown = (targetDate:string) => {
    const [status, setStatus] = useState<TimerStatus>({
        days: 0, hours: 0, minutes: 0, seconds: 0,
        isUrgent: false, isExpired: false
    });

    useEffect(() => {
        const diff:number = new Date(targetDate).getTime() - new Date().getTime();
        if (diff <= 0) {
            setStatus(prev => ({ ...prev, isExpired: true }));
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setStatus({
                days,
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
                isUrgent: days < 1,
                isExpired: false
            });
        }

        const timer = setInterval(() => {
            const diff:number = new Date(targetDate).getTime() - new Date().getTime();
            if (diff <= 0) {
                setStatus(prev => ({ ...prev, isExpired: true }));
                clearInterval(timer);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                setStatus({
                    days,
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                    isUrgent: days < 1,
                    isExpired: false
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return status;
};

const CountdownLabel: React.FC<CountdownLabelProps> = ({ status }) => {
    if (status.isExpired) return null; // หมดเวลาแล้วไม่ต้องโชว์ตัวเลข

    return (
        <div className={`absolute z-31 right-5 bottom-3 ${status.isUrgent ? 'text-red-600 font-bold' : 'opacity-60'}`}>
            {status.isUrgent ? (
                <span>
                    จะสิ้นสุดในอีก {String(status.hours).padStart(2, '0')}:
                    {String(status.minutes).padStart(2, '0')}:
                    {String(status.seconds).padStart(2, '0')}
                </span>
            ) : (
                <span>จะสิ้นสุดการรับสมัครในอีก {status.days} วัน</span>
            )}
        </div>
    );
};

const MissionOverlay: React.FC<MissionOverlayProps> = ({ isExpired }) => {
    if (!isExpired) return null;

    return (
        <div className="absolute z-30 rounded-xl left-0 top-0 backdrop-blur-lg backdrop-brightness-75 inset-0 flex items-center justify-center">
            <span className="font-bold text-white text-2xl shadow-xs">หมดเขตรับสมัครแล้ว</span>
        </div>
    );
};

const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export default function applicationHome() {
    const { user, isLoading, session, signOut } = useUser();
    const router = useRouter();
    const { hasApplication, createApplication, studentStatus, studentInfo, applicationId, studentFaceImage } = useStudent();

    const statusExpired = useCountdown("2026-02-23T23:59:59");

    const myMissions: Mission[] = [
        { id: 1, status: `${ studentStatus?.std_status_info_done ? 'completed' : 'current' }`, label: 'ทะเบียนประวัติ', icon: faUser, action: () => {router.push('/application/register')} },
        { id: 2, status: `${ studentStatus?.std_status_regis_question_done ? 'completed' : 'current' }`, label: 'ด่านตรวจเข้าเมือง', icon: faTents, action: () => {router.push('/application/question-regis')} },
        { id: 3, status: `${ studentStatus?.std_status_academic_question_done ? 'completed' : 'current' }`, label: 'บททดสอบแห่งพงไพร', icon: faPersonHiking, action: () => {router.push('/application/question-academic')} },
        { id: 4, status: `${ studentStatus?.std_status_academic_chaos_done ? 'completed' : 'current' }`, label: 'ถอดรหัสสัญชาตญาณ', icon: faSignsPost, action: () => {router.push('/application/question-aptitude')} },
        { id: 5, status: `${ studentStatus?.std_status_file_done ? 'completed' : 'current' }`, label: 'ยื่นหลักฐานเข้าเมือง', icon: faFolderOpen, action: () => {router.push('/application/file')} },
    ];

    if (user == null && !isLoading ) {
        return (<div></div>)
    }

    return (
        <>
        <main className="flex-1 w-full max-w-[1280px] mx-auto py-3 px-3 md:px-6 flex flex-col gap-3 md:gap-5 mt-5 md:mt-0">

            <div className="order-2 md:order-1">

                <div className="absolute w-full justify-center left-0 z-20 hidden md:flex">
                    <HorizontalMissionPath missions={myMissions}/>
                </div>
                <div className="md:h-[250px] w-full relative bg-slate-900 rounded-xl shadow-sm px-7 py-5">
                    <MissionOverlay isExpired={statusExpired.isExpired} />
                    <div className="text-2xl font-bold z-31 absolute bg-slate-900 pb-3">ภารกิจของคุณ <FontAwesomeIcon icon={faMapLocationDot} /></div>
                    <div className="block md:hidden">
                        <div className="backdrop-blur-md rounded-2xl shadow-xl py-4">
                            <VerticalMissionPath missions={myMissions} />
                        </div>
                    </div>
                    <CountdownLabel status={statusExpired} />
                </div>

            </div>

            <div className="grid grid-cols-1 grid-rows-none md:grid-cols-5 md:grid-rows-2 gap-y-5 md:gap-5 order-1 md:order-2 z-50">

                <div className="col-span-1 md:col-span-2 md:row-span-2 bg-slate-900 rounded-xl shadow-sm px-5 py-6 flex flex-col items-center gap-6">

                    <div className="w-35 h-35 bg-white rounded-full shadow-sm relative">
                        <img
                            src={studentFaceImage || user?.image || "https://storage.comcamp.io/web-assets/gooseNick.png"}
                            onError={(e) => { e.currentTarget.src = "https://storage.comcamp.io/web-assets/gooseNick.png"; }}
                            alt=""
                            className="relative z-10 w-full h-full bg-slate-700 border-white border border-5 rounded-full object-cover object-top"
                        />
                        <Image
                            src="/RabbitEars.png"
                            alt=""
                            loading="eager"
                            width={800}
                            height={800}
                            className="w-35 absolute -top-28.5 z-0"
                        />
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold">{decodeURIComponent(studentInfo?.std_info_first_name || "")} {decodeURIComponent(studentInfo?.std_info_last_name || "")} ({decodeURIComponent(studentInfo?.std_info_nick_name || "")})</div>
                        <div className="text-lg font-medium">{decodeURIComponent(studentInfo?.std_info_education_institute || "")}</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">อีเมล</div>
                        <div className="font-medium">{user?.email}</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">เบอร์โทรศัพท์</div>
                        <div className="font-medium">{formatPhoneNumber(studentInfo?.std_info_phone_number || "")}</div>
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">ระดับชั้นการศึกษา</div>
                        <div className="font-medium">{decodeURIComponent(studentInfo?.std_info_education_level || "")}</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">แผนการเรียน</div>
                        <div className="font-medium">{decodeURIComponent(studentInfo?.std_info_education_plan || "")}</div>
                    </div>

                </div>

                <div className="hidden md:flex col-span-3 row-span-1 bg-slate-900 rounded-xl shadow-sm p-5 flex-col justify-center align-middle items-center">

                    <Button
                        type="button"
                        className="h-[40%] w-[50%] text-lg font-bold rounded-xl bg-primary hover:bg-primary/90"
                    >
                        ส่งใบสมัคร
                    </Button>

                </div>

                <div className="hidden md:flex col-span-3 row-span-1 bg-slate-900 rounded-xl shadow-sm p-5 flex-col justify-center align-middle items-center">



                </div>
            </div>
            <div className="grid md:hidden grid-cols-1 grid-rows-none md:grid-cols-5 md:grid-rows-2 gap-y-5 md:gap-5 order-3">

                <div className="flex col-span-3 row-span-1 bg-slate-900 rounded-xl shadow-sm p-6 flex-col justify-center align-middle items-center">

                    <Button
                        type="button"
                        className="px-12 py-7 font-bold rounded-xl bg-primary hover:bg-primary/90"
                    >
                        ส่งใบสมัคร
                    </Button>

                </div>
            </div>
        </main>
        </>
    );
}