"use client";

import { useContext } from "react";
import RegisterContent, { RegisterProvider, RegisterCtx } from "./RegisterContext";

export default function RegisterPage() {
    return (
        <RegisterProvider>
            <RegisterPageInner />
        </RegisterProvider>
    );
}

function RegisterPageInner() {
    const { step, allData } = useContext(RegisterCtx);

    const totalSteps = 3;
    const progress = Math.round((step / totalSteps) * 100);

    return (
        <main className="flex-1 w-full max-w-[960px] mx-auto pt-6 md:px-6 md:pt-10">
            <div className="bg-twilight-indigo-900 rounded-[40px] md:rounded-xl border border-twilight-indigo-800 shadow-sm overflow-hidden p-6 md:p-6 mb-5 drop-shadow-xl drop-shadow-black/20">
                <div className="mb-6 flex flex-col gap-2 px-4 md:px-0">
                    <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">ทะเบียนประวัติ</h1>
                    <p className="text-twilight-indigo-300 text-sm font-normal">ขั้นตอนที่ {step}: {getStepName(step)}</p>
                </div>

                <div className="flex flex-col gap-2 px-4 md:px-0">
                    <div className="flex justify-between items-end">
                        <p className="text-twilight-indigo-200 text-base font-medium">ขั้นตอนที่ {step} จาก {totalSteps}</p>
                        <p className="text-twilight-indigo-200 font-bold text-sm">{progress}%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-twilight-indigo-200 overflow-hidden">
                        <div
                            className="h-full bg-[#eb8b51] rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }} // ปรับความยาวหลอดตาม Progress
                        ></div>
                    </div>
                </div>
            </div>

            <RegisterContent />
        </main>
    );
}

function getStepName(step: number) {
    const names: Record<number, string> = {
        1: "ข้อมูลส่วนตัว",
        2: "ข้อมูลการศึกษา และสุขภาพ",
        3: "ข้อมูลติดต่อผู้ปกครอง และความพร้อม",
    };
    return names[step] || "";
}