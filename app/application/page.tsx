"use client";

import Image from 'next/image';
import {AnimatePresence, motion} from "motion/react"

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
import {REGIS_EXPIRED_DATE, TimerStatus, useCountdown} from "@/app/application/countdown";
import {toast} from "sonner";
import {addYears, format} from "date-fns";
import {th} from "date-fns/locale";

interface CountdownLabelProps {
    status: TimerStatus;
}

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

const MissionOverlay: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    const overlayContent = {
        INCOMPLETE: null,
        READY: null,
        SUBMITTED: 'ส่งใบสมัครเรียบร้อยแล้ว',
        EXPIRED: 'หมดเขตรับสมัครแล้ว',
    };

    const text = overlayContent[status];

    if (!text) return null;

    return (
        <AnimatePresence>
            {text && (
                <motion.div
                    // ตั้งค่าแอนิเมชันของพื้นหลัง (Fade in/out)
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute z-32 rounded-xl left-0 top-0 backdrop-blur-lg backdrop-brightness-75 inset-0 flex items-center justify-center"
                >
                    <motion.span
                        // ตั้งค่าแอนิเมชันของตัวหนังสือ (เด้งดึ๋งนิดๆ ตอนโผล่มา)
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 10 }}
                        transition={{ type: "spring", bounce: 0.4, duration: 0.5, delay: 0.1 }}
                        className="font-bold text-white text-2xl shadow-xs drop-shadow-md drop-shadow-black"
                    >
                        {text}
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export type ApplicationStatus = 'INCOMPLETE' | 'READY' | 'SUBMITTED' | 'EXPIRED';

interface ApplicationCardProps {
    status: ApplicationStatus;
    loading: boolean;
    onSubmit?: () => void;
}

function ApplicationCard({ status, loading, onSubmit }: ApplicationCardProps) {
    const statusConfig = {
        INCOMPLETE: {
            title: 'ภารกิจยังไม่สำเร็จ',
            description: 'คุณยังกรอกข้อมูลหรือแนบเอกสารไม่ครบถ้วน',
            buttonText: 'รอการดำเนินการ',
            buttonClass: 'bg-twilight-indigo-600 hover:bg-twilight-indigo-600 cursor-not-allowed opacity-70',
            isDisabled: true,
            imgClass: 'opacity-50',
        },
        READY: {
            title: 'ภารกิจเสร็จสิ้น',
            description: 'ใบสมัครของคุณพร้อมแล้ว โปรดตรวจสอบข้อมูลก่อนกดส่งใบสมัคร',
            buttonText: 'ส่งใบสมัคร',
            buttonClass: 'bg-white text-black hover:bg-gray-300 cursor-pointer',
            isDisabled: false,
            imgClass: '',
        },
        SUBMITTED: {
            title: 'ส่งใบสมัครเรียบร้อยแล้ว',
            description: 'ระบบได้รับใบสมัครของคุณแล้ว รอติดตามผลการคัดเลือกได้เลย!',
            buttonText: 'ส่งข้อมูลสำเร็จ',
            buttonClass: 'hidden',
            isDisabled: true,
            imgClass: '',
        },
        EXPIRED: {
            title: 'หมดเวลารับสมัคร',
            description: 'ขออภัย หมดเขตรับสมัครแล้ว',
            buttonText: 'หมดเวลา',
            buttonClass: 'bg-twilight-indigo-600 hover:bg-twilight-indigo-600 cursor-not-allowed opacity-70',
            isDisabled: true,
            imgClass: 'grayscale opacity-50',
        },
    };

    const current = statusConfig[status];

    return (
        <div className="hidden md:flex flex-row gap-x-10 col-span-3 row-span-1 bg-twilight-indigo-900 rounded-xl shadow-sm px-10 py-8 justify-evenly align-middle items-center">
            <Image
                src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/docsIcon.png`}
                alt="Document Icon"
                loading="eager"
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                className={`relative w-30 scale-135 rotate-20 transition-all duration-300 ${current.imgClass}`}
            />
            <div className="flex-1 h-full flex flex-col justify-evenly gap-4">
                <div>
                    <div className="text-2xl font-bold text-white transition-colors duration-300">
                        {current.title}
                    </div>
                    <div className="text-lg text-twilight-indigo-300 mt-2 transition-colors duration-300">
                        {current.description}
                    </div>
                </div>
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={current.isDisabled || loading}
                    onClick={status === 'READY' ? onSubmit : undefined}
                    className={`h-12 w-full text-lg font-bold rounded-xl ${current.buttonClass}`}
                >
                    {loading ? 'กำลังส่งใบสมัคร...' : current.buttonText}
                </motion.button>
            </div>
        </div>
    );
}

function ApplicationCardMD({ status, loading, onSubmit }: ApplicationCardProps) {
    const statusConfig = {
        INCOMPLETE: {
            title: 'ภารกิจยังไม่สำเร็จ',
            description: 'คุณยังกรอกข้อมูลหรือแนบเอกสารไม่ครบถ้วน',
            buttonText: 'รอการดำเนินการ',
            buttonClass: 'bg-twilight-indigo-600 hover:bg-twilight-indigo-600 cursor-not-allowed opacity-70',
            isDisabled: true,
            imgClass: 'opacity-50',
        },
        READY: {
            title: 'ภารกิจสำเร็จ',
            description: 'ใบสมัครของคุณพร้อมแล้ว โปรดตรวจสอบข้อมูลก่อนกดส่งใบสมัคร',
            buttonText: 'ส่งใบสมัคร',
            buttonClass: 'bg-primary hover:bg-primary/90 cursor-pointer',
            isDisabled: false,
            imgClass: '',
        },
        SUBMITTED: {
            title: 'ส่งใบสมัครเรียบร้อยแล้ว',
            description: 'ระบบได้รับใบสมัครของคุณแล้ว รอติดตามผลการคัดเลือกได้เลย!',
            buttonText: 'ส่งข้อมูลสำเร็จ',
            buttonClass: 'hidden',
            isDisabled: true,
            imgClass: '',
        },
        EXPIRED: {
            title: 'หมดเวลารับสมัคร',
            description: 'ขออภัย หมดเขตรับสมัครแล้ว',
            buttonText: 'หมดเวลา',
            buttonClass: 'bg-twilight-indigo-600 hover:bg-twilight-indigo-600 cursor-not-allowed opacity-70',
            isDisabled: true,
            imgClass: 'grayscale opacity-50',
        },
    };

    const current = statusConfig[status];

    return (
        <div className="flex bg-twilight-indigo-900 rounded-xl shadow-sm p-6 flex-col items-center gap-y-10">
            <Image
                src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/docsIcon.png`}
                alt="Document Icon"
                loading="eager"
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                className={`relative w-[50%] rotate-20 transition-all duration-300 ${current.imgClass}`}
            />
            <div className="w-full h-full flex flex-col justify-evenly gap-4">
                <div>
                    <div className="text-2xl font-bold text-white transition-colors duration-300">
                        {current.title}
                    </div>
                    <div className="text-lg text-twilight-indigo-300 mt-2 transition-colors duration-300">
                        {current.description}
                    </div>
                </div>
                <Button
                    type="button"
                    disabled={current.isDisabled || loading}
                    onClick={status === 'READY' ? onSubmit : undefined}
                    className={`h-14 w-full text-lg font-bold rounded-xl transition-all duration-300 ${current.buttonClass}`}
                >
                    {loading ? 'กำลังส่งใบสมัคร...' : current.buttonText}
                </Button>
            </div>
        </div>
    );
}

export default function applicationHome() {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const { studentStatus, studentInfo, studentFaceImage, ApplicationStatus, refreshApplication, applicationId } = useStudent();

    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const statusExpired = useCountdown(REGIS_EXPIRED_DATE);
    let currentStatus: ApplicationStatus = 'INCOMPLETE';

    if (ApplicationStatus?.std_application_submit == true) {
        currentStatus = "SUBMITTED"
    } else if (statusExpired.isExpired) {
        currentStatus = 'EXPIRED';
    } else if (
        studentStatus?.std_status_info_done &&
        studentStatus.std_status_file_done &&
        studentStatus.std_status_regis_question_done &&
        studentStatus.std_status_acdemic_question_done &&
        studentStatus.std_status_academic_chaos_question_done
    ) {
        currentStatus = "READY"
    }

    const myMissions: Mission[] = [
        { id: 1, status: `${ studentStatus?.std_status_info_done ? 'completed' : 'current' }`, label: 'ทะเบียนประวัติ', icon: faUser, action: () => {router.push('/application/register')} },
        { id: 2, status: `${ studentStatus?.std_status_regis_question_done ? 'completed' : 'current' }`, label: 'ด่านตรวจเข้าเมือง', icon: faTents, action: () => {router.push('/application/question-regis')} },
        { id: 3, status: `${ studentStatus?.std_status_acdemic_question_done ? 'completed' : 'current' }`, label: 'บททดสอบแห่งพงไพร', icon: faPersonHiking, action: () => {router.push('/application/question-academic')} },
        { id: 4, status: `${ studentStatus?.std_status_academic_chaos_question_done ? 'completed' : 'current' }`, label: 'ถอดรหัสสัญชาตญาณ', icon: faSignsPost, action: () => {router.push('/application/question-aptitude')} },
        { id: 5, status: `${ studentStatus?.std_status_file_done ? 'completed' : 'current' }`, label: 'ยื่นหลักฐานเข้าเมือง', icon: faFolderOpen, action: () => {router.push('/application/file')} },
    ];

    if (user == null && !isLoading ) {
        return (<div></div>)
    }

    const handleSubmitApplication = async () => {
        setSubmitLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/submit`,
                {
                    application_id: applicationId,
                    confirm: true
                },
                { withCredentials: true }
            );

            await refreshApplication();
            toast.success("ส่งเรียบร้อยแล้ว");

            setIsConfirmModalOpen(false);

        } catch (error: any) {
            console.error(error);
            toast.error("ส่งไม่สำเร็จ", {
                description: error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitLoading && setIsConfirmModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* กล่อง Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                            className="relative w-full max-w-xl bg-twilight-indigo-900 border border-twilight-indigo-700 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">ยืนยันการส่งใบสมัคร</h2>
                                <p className="text-twilight-indigo-300">
                                    โปรดตรวจสอบข้อมูลให้ครบถ้วนและถูกต้อง <br/>
                                    <span className="text-red-400 font-medium">หากกดยืนยันแล้ว จะไม่สามารถกลับมาแก้ไขข้อมูลได้อีก</span>
                                </p>
                            </div>

                            {/* กล่อง Checkbox ยืนยันความจริง */}
                            <label className="flex items-start gap-3 p-4 bg-twilight-indigo-900/50 border border-twilight-indigo-700 rounded-xl cursor-pointer hover:bg-twilight-indigo-800 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    disabled={isSubmitLoading}
                                    className="mt-1 w-5 h-5 rounded border-twilight-indigo-500 text-primary cursor-pointer focus:ring-primary focus:ring-offset-twilight-indigo-900 bg-twilight-indigo-900"
                                />
                                <span className="text-twilight-indigo-200 select-none text-sm md:text-base leading-relaxed">
                        ข้าพเจ้าขอยืนยันว่าข้อมูลที่กรอก และเอกสารที่แนบมาทั้งหมดในการสมัคร ComCamp37 เป็นความจริงทุกประการ
                    </span>
                            </label>

                            {/* ปุ่มกดยกเลิก / ยืนยัน */}
                            <div className="flex flex-col-reverse md:flex-row gap-3 justify-end mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    disabled={isSubmitLoading}
                                    className="cursor-pointer w-full md:w-auto border-twilight-indigo-600 text-twilight-indigo-300 hover:bg-twilight-indigo-700 hover:text-white transition-colors"
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmitApplication}
                                    // ปุ่มจะกดได้ก็ต่อเมื่อติ๊กถูกแล้ว และไม่ได้อยู่ในสถานะ Loading
                                    disabled={!isAgreed || isSubmitLoading}
                                    className={`w-full md:w-auto font-bold transition-all ${
                                        isAgreed ? ' cursor-pointer bg-gray-100 text-black hover:bg-gray-300 hover:text-black' : 'bg-twilight-indigo-700 text-twilight-indigo-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isSubmitLoading ? 'กำลังส่งข้อมูล...' : 'ส่งใบสมัคร'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        <main className="flex-1 w-full max-w-[1280px] mx-auto py-3 px-3 md:px-6 flex flex-col gap-3 md:gap-5 mt-5 md:mt-0">

            <div className="order-2 md:order-1">

                <div className="absolute w-full justify-center left-0 z-20 hidden md:flex">
                    <HorizontalMissionPath missions={myMissions}/>
                </div>
                <div className="md:h-[250px] w-full relative bg-twilight-indigo-900 rounded-xl shadow-sm px-7 py-5">
                    <MissionOverlay status={currentStatus} />
                    <div className="text-2xl font-bold z-30 absolute bg-twilight-indigo-900 pb-3">ภารกิจของคุณ <FontAwesomeIcon icon={faMapLocationDot} /></div>
                    <div className="block md:hidden">
                        <div className="backdrop-blur-md rounded-2xl shadow-xl py-4">
                            <VerticalMissionPath missions={myMissions} />
                        </div>
                    </div>
                    <CountdownLabel status={statusExpired}/>
                </div>

            </div>

            <div className="grid grid-cols-1 grid-rows-none md:grid-cols-5 md:grid-rows-2 gap-y-5 md:gap-5 order-1 md:order-2 z-50">

                <div className="col-span-1 md:col-span-2 md:row-span-2 bg-twilight-indigo-900 rounded-xl shadow-sm px-5 py-6 flex flex-col items-center gap-6">

                    <div className="w-35 h-35 bg-white rounded-full shadow-sm relative">
                        <img
                            src={studentFaceImage || user?.image || "https://storage.comcamp.io/web-assets/gooseNick.png"}
                            onError={(e) => { e.currentTarget.src = "https://storage.comcamp.io/web-assets/gooseNick.png"; }}
                            alt=""
                            className="relative z-10 w-full h-full bg-twilight-indigo-700 border-white border border-5 rounded-full object-cover object-top"
                        />
                        <Image
                            src={`${process.env.NEXT_PUBLIC_STATIC_ASSETS_URL}/RabbitEars.png`}
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
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">วันเกิด</div>
                        <div className="font-medium">{studentInfo?.std_info_birthdate ? format(addYears(studentInfo?.std_info_birthdate, 543), "d MMMM yyyy", { locale: th }) : ""}</div>
                    </div>

                </div>

                <ApplicationCard status={currentStatus} onSubmit={() => {
                    setIsAgreed(false);
                    setIsConfirmModalOpen(true);
                }} loading={isSubmitLoading}></ApplicationCard>

                <div className="hidden md:flex flex-row gap-x-10 col-span-3 row-span-1 bg-twilight-indigo-900 rounded-xl shadow-sm py-1.5 justify-center align-middle items-center overflow-hidden">
                    <Image src="https://storage.comcamp.io/web-assets/UnderConstruction.webp" height={0} width={0} sizes="100%" alt="" unoptimized
                        className="w-full"
                    />
                </div>

            </div>
            <div className="grid md:hidden grid-cols-1 grid-rows-none md:grid-cols-5 md:grid-rows-2 gap-y-5 md:gap-5 order-3">
                <ApplicationCardMD status={currentStatus} onSubmit={() => {
                    setIsAgreed(false);
                    setIsConfirmModalOpen(true);
                }} loading={isSubmitLoading}></ApplicationCardMD>
            </div>
        </main>
        </>
    );
}