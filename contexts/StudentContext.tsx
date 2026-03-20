"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";
import axios from "axios";

import { mockStudentApplication } from "@/mock/MockData";

const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// 1. กำหนด Type ของ Status ให้ตรงกับ Database/API
export interface StudentStatus {
    std_application_id: string;
    std_status_info_done: boolean;
    std_status_file_done: boolean;
    std_status_regis_question_done: boolean;
    std_status_acdemic_question_done: boolean;
    std_status_academic_chaos_question_done: boolean;
    std_status_payment_done: boolean;
}

export type resultStatus = 'fail' | 'pass' | 'reserve' | 'waiting_for_announcement';

export interface ApplicationStatus {
    std_application_id: string;
    std_application_submit: boolean;
    std_application_confirm: boolean;
    std_application_abort_reason: null;
    std_application_pass: false;
    std_application_result: resultStatus;
}

export interface StudentInfo {
    std_application_id: string,
    std_info_prefix: string,
    std_info_first_name: string,
    std_info_last_name: string,
    std_info_nick_name: string,
    std_info_age: number,
    std_info_birthdate: string,
    std_info_gender: string,
    std_info_sexuality: string,
    std_info_religion: string,
    std_info_phone_number: string,
    std_info_education_level: string,
    std_info_education_institute: string,
    std_info_education_plan: string,
    std_info_grade_gpax: string,
    std_info_grade_math: string,
    std_info_grade_sci: string,
    std_info_grade_eng: string,
    std_info_parent_fullname: string,
    std_info_parent_relation: string,
    std_info_parent_phone_number: string,
    std_info_have_participated: boolean,
    std_info_have_laptop: boolean,
    std_info_can_participate_every_day: boolean,
    std_info_medical_insurance: string,
    std_info_chronic_disease: string,
    std_info_drug_allergy: string,
    std_info_food_allergy: string,
    std_info_blood_group: string,
    std_info_address: string,
    std_info_shirt_size: string,
    std_info_travel_plan: string,
    std_info_laptop_os: string,
    std_info_have_tablet: boolean,
    std_info_have_mouse: boolean,

    created_at: string,
    updated_at: string
}

interface StudentRegisAnswer {
    std_application_id: string,
    std_regis_answer_id: number,
    std_regis_answer_section: string,
    std_regis_answer: string,
    created_at: string,
    updated_at: string
}

interface StudentAcademicAnswer {
    std_application_id: string,
    std_academic_answer_id: number,
    std_academic_answer_section: string,
    std_academic_answer: string,
    created_at: string,
    updated_at: string
}

interface StudentAcademicChaosAnswer {
    std_application_id: string,
    std_academic_chaos_answer_id: number,
    std_academic_chaos_answer_section: string,
    std_academic_chaos_answer: string,
    created_at: string,
    updated_at: string
}

interface StudentContextType {
    applicationId: string | null; // เก็บแค่ ID
    studentStatus: StudentStatus | null; // เก็บแค่ Status Object
    ApplicationStatus: ApplicationStatus | null;
    studentInfo: StudentInfo | null;
    studentRegisAnswer: StudentRegisAnswer[] | null;
    studentAcademicAnswer: StudentAcademicAnswer[] | null;
    studentAcademicChaosAnswer: StudentAcademicChaosAnswer[] | null;
    studentFaceImage: string | null;
    isLoadingApp: boolean;
    createApplication: () => Promise<void>;
    hasApplication: boolean;
    refreshApplication: () => Promise<void>; // เพิ่มฟังก์ชันให้เรียกโหลดใหม่ได้
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();

    // แยก State เก็บ ID และ Status
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(null);
    const [status, setStatus] = useState<StudentStatus | null>(null);
    const [stdInfo, setStdInfo] = useState<StudentInfo | null>(null);

    const [regisAns, setRegisAns] = useState<StudentRegisAnswer[] | null>(null);
    const [academicAns, setAcademicAns] = useState<StudentAcademicAnswer[] | null>(null);
    const [academicChaosAns, setAcademicChaosAns] = useState<StudentAcademicChaosAnswer[] | null>(null);

    const [faceImage, setFaceImage] = useState<string | null>(null);

    const [isLoadingApp, setIsLoadingApp] = useState(true); // เริ่มต้น true ไว้ก่อน

    // ฟังก์ชันดึงข้อมูล (GET)
    const fetchApplication = async () => {
        if (!user && !isMockMode) { // ถ้า Mock อยู่ ไม่ต้องรอ user ก็ได้
            setIsLoadingApp(true);
            return;
        }

        try {
            let res;
            if (isMockMode) {
                // --- จังหวะ Mock ---
                console.log("🛠️ StudentContext: Using Mock Data");
                await new Promise(resolve => setTimeout(resolve, Number(process.env.NEXT_PUBLIC_MOCK_LOADINGTIME) || 0)); // จำลองดีเลย์
                res = { data :mockStudentApplication };
            } else {
                res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/application`, { withCredentials: true });
            }

            if (res.data && res.data.length > 0) {
                const appData = res.data[0];
                setApplicationId(appData.std_application_id);
                setStatus(appData.std_status);
                setAppStatus(appData);
                setStdInfo(appData.std_info);

                setRegisAns(appData.std_regis_question);
                setAcademicAns(appData.std_academic_question);
                setAcademicChaosAns(appData.std_academic_chaos_question);

                await fetchFaceImage(appData.std_application_id);
            } else {
                setApplicationId(null);
                setStatus(null);
                setAppStatus(null);
                setStdInfo(null);
                setRegisAns(null);
                setAcademicAns(null);
                setAcademicChaosAns(null);
            }
            setIsLoadingApp(false);

        } catch (error:any) {
            console.error("Failed to fetch application:", error);
            if (error.response && error.response.status === 404) {
                setApplicationId(null);
                setStatus(null);
                setAppStatus(null);
                setStdInfo(null);
                setRegisAns(null);
                setAcademicAns(null);
                setAcademicChaosAns(null);

                setIsLoadingApp(false);
            } else {
                console.log(`Error ${error.response?.status || 'Unknown'}: กำลังลองใหม่ใน 3 วินาที...`);
                setTimeout(() => {
                    fetchApplication();
                }, 3000);
            }
        }
    };

    const fetchFaceImage = async (id:string) => {

        try {
            // ไม่ต้อง set loading true ตรงนี้ เพื่อไม่ให้หน้ากระพริบถ้ารีเฟรชเงียบๆ
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/file/${id}/file_face`, { withCredentials: true });

            // API Get All return Array [] -> เราเอาตัวแรก
            console.log(res)
            if (res.data && res.data.length > 0) {
                const appData = res.data[0];
                setFaceImage(appData.file_url)
            } else {
                setFaceImage(null)
            }
        } catch (error) {
            console.error("Failed to fetch face image:", error);
            setFaceImage(null)
        }
    };

    // เรียกดึงข้อมูลเมื่อ User Login เข้ามา
    useEffect(() => {
        fetchApplication();
    }, [user]);

    // ฟังก์ชันสร้างใบสมัคร (POST)
    const createApplication = async () => {
        try {
            setIsLoadingApp(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/application/create`, {}, { withCredentials: true });

            // API Create return Object {} (ไม่ใช่ Array)
            const newApp = res.data;

            if (newApp) {
                setApplicationId(newApp.std_application_id);
                setStatus(newApp.std_status);
                setAppStatus(newApp);
                setStdInfo(newApp.std_info);
                setRegisAns(newApp.std_regis_question)
                setAcademicAns(newApp.std_academic_question)
                setAcademicChaosAns(newApp.std_academic_chaos_question)
                setFaceImage(null)
                console.log("Application Created:", newApp);
            }
        } catch (error) {
            console.error("Error creating application:", error);
            throw error; // โยน error ออกไปเผื่อ UI อยากแสดง Alert
        } finally {
            setIsLoadingApp(false);
        }
    };

    const value = {
        applicationId,
        studentStatus: status,
        ApplicationStatus: appStatus,
        studentInfo: stdInfo,
        studentRegisAnswer: regisAns,
        studentAcademicAnswer: academicAns,
        studentAcademicChaosAnswer: academicChaosAns,
        studentFaceImage: faceImage,
        isLoadingApp,
        createApplication,
        hasApplication: !!applicationId, // เช็คว่ามี ID หรือไม่
        refreshApplication: fetchApplication, // ส่งออกไปให้หน้าอื่นใช้ (เช่น หลังอัปโหลดไฟล์เสร็จ)
    };

    return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudent = () => {
    const context = useContext(StudentContext);
    if (context === undefined) {
        throw new Error("useStudent must be used within a StudentProvider");
    }
    return context;
};