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
        <main className="flex-1 w-full max-w-[960px] mx-auto py-6 md:px-6 md:py-10">
            <div className="mb-6 flex flex-col gap-2 px-4 md:px-0">
                <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">Registration</h1>
                <p className="text-slate-300 text-sm font-normal">Step {step}: {getStepName(step)}</p>
            </div>

            <div className="mb-8 flex flex-col gap-2 px-4 md:px-0">
                <div className="flex justify-between items-end">
                    <p className="text-slate-200 text-base font-medium">Step {step} of {totalSteps}</p>
                    <p className="text-slate-200 font-bold text-sm">{progress}%</p>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                        className="h-full bg-[#eb8b51] rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }} // ปรับความยาวหลอดตาม Progress
                    ></div>
                </div>
            </div>

            <RegisterContent />

            <div className="mt-50 bg-slate-900 rounded-3xl p-6">
                <span className="font-bold text-xl">Form Debugger</span>
                <pre className="bg-slate-800/60 p-2 rounded-lg mt-4 h-100 overflow-auto">
                    {JSON.stringify(allData, null, 2)}
                </pre>
            </div>
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