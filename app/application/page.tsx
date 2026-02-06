"use client";

import Image from 'next/image';
import { motion } from "motion/react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFolderOpen, faQuestionCircle, faUser} from "@fortawesome/free-solid-svg-icons";
import MissionPath, {Mission} from "@/app/application/MissionPath";
import {authClient} from "@/lib/auth-client";

export default function applicationHome() {
    const { data: session, isPending, error } = authClient.useSession();

    const myMissions: Mission[] = [
        { id: 1, status: 'completed', label: 'ข้อมูลส่วนตัว', icon: faUser },
        { id: 2, status: 'current', label: 'คำถาม1', icon: faQuestionCircle },
        { id: 3, status: 'locked', label: 'คำถาม2', icon: faQuestionCircle },
        { id: 4, status: 'locked', label: 'อัปโหลดเอกสาร', icon: faFolderOpen },
    ];
    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto py-3 px-3 md:px-6 md:py-10 flex flex-col gap-5">

            <div>
                <div className="absolute w-full flex justify-center left-0 z-20">
                    <MissionPath missions={myMissions}/>

                </div>
                <div className="h-[250px] w-full relative bg-slate-900 rounded-xl shadow-sm px-7 py-5">
                    <div className="text-2xl font-bold">ภารกิจของคุณ</div>
                    <div className="absolute right-5 bottom-3 opacity-60">จะสิ้นสุดการรับสมัครในอีก ... วัน</div>

                    <div className="h-[250px] w-full left-0 top-0 absolute bg-slate-900 rounded-xl shadow-sm px-7 py-5 z-30 hidden">
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 grid-rows-none md:grid-cols-5 md:grid-rows-2 gap-y-5 md:gap-5">

                <div className="col-span-1 md:col-span-2 md:row-span-2 bg-slate-900 rounded-xl shadow-sm px-5 py-6 flex flex-col items-center gap-6">

                    <div className="w-35 h-35 bg-white rounded-full shadow-sm relative">
                        <img
                            src={session ? session.user.image || "https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=DUKuRxK9OINHXt3_4m-GxraeoDDlhNuCbA9hp6FotFE=": "https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=DUKuRxK9OINHXt3_4m-GxraeoDDlhNuCbA9hp6FotFE="}
                            alt="Your Photo"
                            className="relative z-10 w-full h-full bg-orange-300 border-white border border-5 rounded-full object-cover object-top"
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
                        <div className="text-xl font-bold">ชื่อจริง นามสกุล (ชื่อเล่น)</div>
                        <div className="text-lg font-medium">ชื่อโรงเรียน</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">บัญชี Google</div>
                        {session ? (<div className="font-medium">{session.user.email}</div>) : ''}
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">อีเมล</div>
                        <div className="font-medium">emailllllllll</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">เบอร์โทรศัพท์</div>
                        <div className="font-medium">0XX-XXX-XXXX</div>
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">ระดับชั้นการศึกษา</div>
                        <div className="font-medium">มัธยมศึกษาปีที่ 4</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="font-bold">แผนการเรียน</div>
                        <div className="font-medium">วิทยาศาสตร์ - คณิตศาสตร์</div>
                    </div>

                </div>

                <div className="col-span-3 row-span-1 bg-slate-900 rounded-xl shadow-sm p-5 flex flex-col justify-center align-middle items-center">



                </div>

                <div className="col-span-3 row-span-1 bg-slate-900 rounded-xl shadow-sm p-5 flex flex-col justify-center align-middle items-center">



                </div>
            </div>
        </main>
    );
}