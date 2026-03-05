"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema, Step2Schema, Step3Schema, FormData } from "./schema";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faArrowRight, faBoxArchive,
    faBriefcaseMedical, faCakeCandles, faCalendar, faChild, faChildDress, faCloud, faCross, faDharmachakra, faEnvelope,
    faFloppyDisk,
    faFolderOpen,
    faGraduationCap,
    faHardDrive, faHouse, faOm, faPersonBreastfeeding, faPhone, faSchool, faShirt, faStarAndCrescent, faUser
} from '@fortawesome/free-solid-svg-icons';

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner"
import {SchoolInput} from "@/components/ui/schoolInput";
import { toast } from "sonner"

import {th} from "date-fns/locale";
import {addYears, format, formatDistanceToNow } from "date-fns"
import {useStudent, StudentInfo} from "@/contexts/StudentContext";
import {faApple, faLinux, faMicrosoft, faWindows} from "@fortawesome/free-brands-svg-icons";
import {useUser} from "@/contexts/UserContext";
import {motion} from "motion/react";

interface AddressResponse {
    postal: number;
    province: string;
    district: string;
    subdistrict: string;
}

export interface RegisterFormValues {
    name_prefix: string;
    name_first: string;
    name_last: string;
    name_nick: string;
    info_dob: Date | undefined;
    info_gender: "male" | "female";
    info_religion: string;
    info_phone: string;

    info_zipcode: string;
    info_province: string;
    info_district: string;
    info_sub_district: string;
    info_address: string;

    info_email?: string;

    academic_level: string;
    academic_school: string;
    academic_program: string;
    academic_program_other: string;

    grade_gpax: string;
    grade_math: string;
    grade_sci: string;
    grade_eng: string;

    guardian_name: string;
    guardian_relationship: string;
    guardian_phone: string;

    health_medicalRights: string;
    health_chronicDiseases: string;
    health_more: string;
    health_drugAllergies: string;
    health_dietaryRestrictions: string;
    health_bloodType: "A" | "B" | "AB" | "O" | "ไม่ทราบ";

    availability_haveAttended: "true" | "false";
    availability_laptop: "true" | "false";
    availability_attendAllDays: "true" | "false";
    availability_tablet: "true" | "false";
    availability_mouse: "true" | "false";
    availability_travelPlan: string;
    availability_laptopOS: string;
    availability_laptopOS_other: string;
    apparel_size: string;
}

export const RegisterCtx = createContext<any>(null);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState(1);
    const [allData, setAllData] = useState<Partial<FormData>>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const { studentInfo, applicationId } = useStudent();
    const { user } = useUser();

    const [isDataSelected, setIsDataSelected] = useState<boolean>(false);
    const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
    const [pendingLocalData, setPendingLocalData] = useState<any>(null);
    const [localDataTime, setLocalDataTime] = useState<any>(null);
    const [cloudDataTime, setCloudDataTime] = useState<any>(null);

    const safeDecode = (value: any) => {
        if (!value || typeof value !== 'string') return value || "";
        try { return decodeURIComponent(value); } catch (e) { return value; }
    };

    const mapDbToForm = (info: StudentInfo): Partial<RegisterFormValues> => {
        const dbPlan = safeDecode(info.std_info_education_plan);

        const rawAddress = safeDecode(info.std_info_address);

        let parsedAddress = rawAddress;
        let parsedSubDistrict = "";
        let parsedDistrict = "";
        let parsedProvince = "";
        let parsedZipcode = "";

        // Regex นี้รองรับทั้งคำว่า แขวง/ตำบล และ เขต/อำเภอ (เผื่อเซฟมาต่างกัน)
        const addressRegex = /^(.*?)\s*(?:แขวง|ตำบล)(.*?)\s*(?:เขต|อำเภอ)(.*?)\s*จังหวัด(.*?)\s*(\d{5})$/;
        const addressMatch = rawAddress.match(addressRegex);

        if (addressMatch) {
            parsedAddress = addressMatch[1].trim();
            parsedSubDistrict = addressMatch[2].trim();
            parsedDistrict = addressMatch[3].trim();
            parsedProvince = addressMatch[4].trim();
            parsedZipcode = addressMatch[5].trim();
        }

        const standardPrograms = [
            "วิทยาศาสตร์-คณิตศาสตร์",
            "คณิตศาสตร์-คอมพิวเตอร์",
            "วิทยาศาสตร์-คอมพิวเตอร์",
            "ปวช. สาขาคอมพิวเตอร์ธุรกิจ",
            "ปวช. สาขาช่างไฟฟ้ากำลัง (อิเล็กทรอนิกส์)",
            "ปวช. สาขาเมคคาทรอนิกส์และหุ่นยนต์"
        ];

        let academicProgram = "";
        let academicProgramOther = "";

        if (standardPrograms.includes(dbPlan)) {
            academicProgram = dbPlan;
        } else if (dbPlan) {
            academicProgram = "อื่น ๆ";
            academicProgramOther = dbPlan;
        }

        const fullChronicString = safeDecode(info.std_info_chronic_disease);
        let chronicDisease = fullChronicString;
        let chronicMore = "";
        const separator = ' รายละเอียดเพิ่มเติม "';

        if (fullChronicString.includes(separator)) {
            const parts = fullChronicString.split(separator);
            chronicDisease = parts[0];
            if (parts.length > 1) chronicMore = parts[1].replace(/"$/, '');
        }

        let laptopOS = safeDecode(info.std_info_laptop_os);
        let laptopOSOther = "";

        if (laptopOS.startsWith("Linux")) {
            laptopOSOther = laptopOS.replace("Linux (", "").replace(")", "");
            laptopOS = "Linux";
        } else if (laptopOS.startsWith("อื่น ๆ:")) {
            laptopOSOther = laptopOS.replace("อื่น ๆ: ", "");
            laptopOS = "อื่น ๆ";
        }

        return {
            name_prefix: safeDecode(info.std_info_prefix),
            name_first: safeDecode(info.std_info_first_name),
            name_last: safeDecode(info.std_info_last_name),
            name_nick: safeDecode(info.std_info_nick_name),
            info_dob: info.std_info_birthdate ? new Date(info.std_info_birthdate) : undefined,
            info_gender: safeDecode(info.std_info_gender) as "male" | "female",
            info_religion: safeDecode(info.std_info_religion),
            info_phone: safeDecode(info.std_info_phone_number),

            info_address: parsedAddress,
            info_sub_district: parsedSubDistrict,
            info_district: parsedDistrict,
            info_province: parsedProvince,
            info_zipcode: parsedZipcode,

            academic_level: safeDecode(info.std_info_education_level),
            academic_school: safeDecode(info.std_info_education_institute),

            academic_program: academicProgram,
            academic_program_other: academicProgramOther,

            grade_gpax: info.std_info_grade_gpax,
            grade_math: info.std_info_grade_math,
            grade_sci: info.std_info_grade_sci,
            grade_eng: info.std_info_grade_eng,

            guardian_name: safeDecode(info.std_info_parent_fullname),
            guardian_relationship: safeDecode(info.std_info_parent_relation),
            guardian_phone: safeDecode(info.std_info_parent_phone_number),

            health_medicalRights: safeDecode(info.std_info_medical_insurance),
            health_chronicDiseases: chronicDisease,
            health_more: chronicMore,
            health_drugAllergies: safeDecode(info.std_info_drug_allergy),
            health_dietaryRestrictions: safeDecode(info.std_info_food_allergy),
            health_bloodType: safeDecode(info.std_info_blood_group),

            availability_haveAttended: String(info.std_info_have_participated) as "true" | "false",
            availability_laptop: String(info.std_info_have_laptop) as "true" | "false",
            availability_attendAllDays: String(info.std_info_can_participate_every_day) as "true" | "false",
            availability_tablet: String(info.std_info_have_tablet) as "true" | "false",
            availability_mouse: String(info.std_info_have_mouse) as "true" | "false",

            availability_travelPlan: safeDecode(info.std_info_travel_plan),
            availability_laptopOS: laptopOS,
            availability_laptopOS_other: laptopOSOther,
            apparel_size: safeDecode(info.std_info_shirt_size),
        };
    };

    const loadData = () => {
        if (isDataSelected) return;

        const savedData = localStorage.getItem("comcamp37_reg_input");
        let localParsed = null;

        if (savedData) {
            try {
                localParsed = JSON.parse(savedData);
            } catch (e) { console.error(e); }
        }

        if (studentInfo?.std_application_id === applicationId && localParsed && localParsed.application_id === applicationId) {
            const localTime = new Date(localParsed.updated_at).getTime();
            const dbTime = studentInfo.updated_at ? new Date(studentInfo.updated_at).getTime() : 0;
            setCloudDataTime(dbTime);
            setLocalDataTime(localTime);

            if (localTime > dbTime) {
                setPendingLocalData(localParsed);
                setShowConflictModal(true);
                setIsLoaded(true);
                return;
            }
        }

        if (studentInfo && studentInfo.std_info_first_name) {
            setAllData(prev => ({ ...prev, ...mapDbToForm(studentInfo) }));
        } else if (localParsed && localParsed.email === user?.email) {
            if (localParsed.allData) setAllData(localParsed.allData);
            if (localParsed.step) setStep(localParsed.step);
        }

        setIsLoaded(true);
        setIsDataSelected(true);
    };

    useEffect(() => {
        loadData();
    }, [studentInfo]);

    const saveToLocal = (dataToSave: any, stepToSave: number) => {
        if (!user?.email || !applicationId) return;

        localStorage.setItem(
            "comcamp37_reg_input",
            JSON.stringify({
                step: stepToSave,
                allData: dataToSave,
                email: user.email,
                application_id: applicationId,
                updated_at: new Date()
            })
        );
    };

    const handleUseLocal = () => {
        if (pendingLocalData.allData) setAllData(pendingLocalData.allData);
        if (pendingLocalData.step) setStep(pendingLocalData.step);
        setShowConflictModal(false);
        setIsDataSelected(true);
    };

    const handleUseCloud = () => {
        if (studentInfo == null) return;
        setAllData(prev => ({ ...prev, ...mapDbToForm(studentInfo) }));
        localStorage.removeItem("comcamp37_reg_input");
        setShowConflictModal(false);
        setIsDataSelected(true);
    };

    const next = () => {
        setStep(s => {
            const nextStep = s + 1;
            setAllData(currentData => {
                saveToLocal(currentData, nextStep);
                return currentData;
            });
            return nextStep;
        });
        window.scrollTo(0, 0);
    };

    const prev = () => {
        setStep(s => {
            const prevStep = s - 1;
            setAllData(currentData => {
                saveToLocal(currentData, prevStep);
                return currentData;
            });
            return prevStep;
        });
        window.scrollTo(0, 0);
    };

    const getRelativeTime = (date: Date | string | number) => {
        if (!date) return "ไม่ทราบเวลา";
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: th
        });
    };

    const getFullDateTime = (date: Date | string | number) => {
        if (!date) return "ไม่ระบุเวลา";
        return format(new Date(date), 'd MMM yyyy HH:mm น.', {
            locale: th
        });
    };

    if (!isLoaded) return <div className="p-10 text-center text-white">Loading...</div>;

    return (
        <RegisterCtx.Provider value={{ step, setStep, next, prev, allData, setAllData, saveToLocal }}>
            {showConflictModal ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                        className="relative w-full max-w-xl bg-twilight-indigo-900 border border-twilight-indigo-700 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6"
                    >
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">พบข้อมูลที่ใหม่กว่าบนอุปกรณ์นี้</h2>
                            <p className="text-twilight-indigo-300">
                                คุณมีการแก้ไขล่าสุดบนอุปกรณ์นี้ที่ยังไม่ได้บันทึกลงระบบ ต้องการทำต่อจากที่ค้างไว้ หรือใช้ข้อมูลเดิมจากระบบ
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-3 mt-4 sm:mt-0 justify-between">
                            <div className="flex-1">
                                <Button
                                    type="button"
                                    onClick={handleUseLocal}
                                    className="py-6 w-full font-bold transition-all cursor-pointer bg-gray-100 text-black hover:bg-gray-300 hover:text-black border border-transparent"
                                >
                                    ทำต่อจากที่ค้างไว้ <FontAwesomeIcon icon={faHardDrive}/>
                                </Button>
                                <div className="text-sm text-center text-twilight-indigo-300 opacity-80 pt-2">
                                    แก้ไขเมื่อ {getRelativeTime(localDataTime)}
                                </div>
                            </div>
                            <div className="flex-1">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleUseCloud}
                                    className="py-6 w-full font-bold transition-all cursor-pointer text-white "
                                >
                                    ใช้ข้อมูลเดิมจากระบบ <FontAwesomeIcon icon={faCloud}/>
                                </Button>
                                <div className="text-sm text-center text-twilight-indigo-300 opacity-80 pt-2">
                                    บันทึกล่าสุด {getFullDateTime(cloudDataTime)}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : children
            }

        </RegisterCtx.Provider>
    );
}

export default function RegisterContent() {
    const { step } = useContext(RegisterCtx);
    return (
        <>
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
        </>
    );
}

function Step1() {
    const { next, setAllData, allData, saveToLocal, step } = useContext(RegisterCtx)
    const { user } = useUser();
    const { studentStatus } = useStudent();
    const router = useRouter()

    const [addressOptions, setAddressOptions] = useState<AddressResponse[]>([]);
    const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [availableSubDistricts, setAvailableSubDistricts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(Step1Schema) as any,
        defaultValues: {
            name_prefix: allData?.name_prefix || "",
            name_first: allData?.name_first || "",
            name_last: allData?.name_last || "",
            name_nick: allData?.name_nick || "",

            info_dob: allData?.info_dob || undefined,
            info_gender: allData?.info_gender || "",
            info_religion: allData?.info_religion || "",
            info_phone: allData?.info_phone || "",

            info_zipcode: allData?.info_zipcode || "",
            info_province: allData?.info_province || "",
            info_district: allData?.info_district || "",
            info_sub_district: allData?.info_sub_district || "",
            info_address: allData?.info_address || "",

            academic_level: allData?.academic_level || "",
            academic_program: allData?.academic_program || "",
            academic_program_other: allData?.academic_program_other || "",
            academic_school: allData?.academic_school || "",

            grade_gpax: allData?.grade_gpax || "",
            grade_math: allData?.grade_math || "",
            grade_sci: allData?.grade_sci || "",
            grade_eng: allData?.grade_eng || "",

            health_bloodType: allData?.health_bloodType || "",
            health_medicalRights: allData?.health_medicalRights || "",
            health_chronicDiseases: allData?.health_chronicDiseases || "",
            health_drugAllergies: allData?.health_drugAllergies || "",
            health_dietaryRestrictions: allData?.health_dietaryRestrictions || "",
            health_more: allData?.health_more || "",

            guardian_name: allData?.guardian_name || "",
            guardian_relationship: allData?.guardian_relationship || "",
            guardian_phone: allData?.guardian_phone || "",

            availability_haveAttended: allData?.availability_haveAttended || "",
            availability_attendAllDays: allData?.availability_attendAllDays || "",
            availability_laptop: allData?.availability_laptop || "",
            availability_laptopOS: allData?.availability_laptopOS || "",
            availability_laptopOS_other: allData?.availability_laptopOS_other || "",
            availability_tablet: allData?.availability_tablet || "",
            availability_mouse: allData?.availability_mouse || "",
            availability_travelPlan: allData?.availability_travelPlan || "",

            apparel_size: allData?.apparel_size || "",
        },
    })

    const currentProvince = form.watch("info_province");

    const hasProvince = !!currentProvince && currentProvince.trim() !== "";
    const isBKK = currentProvince === "กรุงเทพมหานคร";

    const districtLabel = isBKK ? "เขต" : (hasProvince ? "อำเภอ" : "เขต/อำเภอ");
    const subDistrictLabel = isBKK ? "แขวง" : (hasProvince ? "ตำบล" : "แขวง/ตำบล");

    const handleZipCodeChange = async (postal: string) => {
        form.setValue("info_province", "");
        form.setValue("info_district", "");
        form.setValue("info_sub_district", "");
        setAvailableProvinces([]);
        setAvailableDistricts([]);
        setAvailableSubDistricts([]);
        form.clearErrors("info_zipcode");

        if (postal.length === 5) {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/util/address?postal=${postal}`);
                const data: AddressResponse[] = await res.json();

                if (!data || data.length === 0) {
                    form.setError("info_zipcode", { type: "manual", message: "ไม่พบรหัสไปรษณีย์นี้" });
                    return;
                }

                setAddressOptions(data);

                const uniqueProvinces = Array.from(new Set(data.map(d => d.province)));
                setAvailableProvinces(uniqueProvinces);

                if (uniqueProvinces.length === 1) {
                    form.setValue("info_province", uniqueProvinces[0]);
                    processDistricts(uniqueProvinces[0], data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const processDistricts = (selectedProvince: string, allData: AddressResponse[]) => {
        const filteredByProvince = allData.filter(d => d.province === selectedProvince);
        const uniqueDistricts = Array.from(new Set(filteredByProvince.map(d => d.district)));

        setAvailableDistricts(uniqueDistricts);

        if (uniqueDistricts.length === 1) {
            form.setValue("info_district", uniqueDistricts[0]);
            processSubDistricts(uniqueDistricts[0], filteredByProvince);
        } else {
            form.setValue("info_district", "");
            form.setValue("info_sub_district", "");
            setAvailableSubDistricts([]);
        }
    };

    const processSubDistricts = (selectedDistrict: string, dataScope: AddressResponse[]) => {
        const subs = dataScope.filter(d => d.district === selectedDistrict).map(d => d.subdistrict);
        setAvailableSubDistricts(subs);

        if (subs.length === 1) {
            form.setValue("info_sub_district", subs[0]);
        } else {
            form.setValue("info_sub_district", "");
        }
    };

    useEffect(() => {
        const { unsubscribe } = form.watch((values, { type }) => {
            setAllData((prev: any) => {
                const newData = { ...prev, ...values }

                if (type) {
                    saveToLocal(newData, step)
                }

                return newData;
            });
        });
        return unsubscribe;
    }, [form.watch, setAllData, step, saveToLocal]);

    useEffect(() => {
        if (allData?.info_zipcode && String(allData.info_zipcode).length === 5) {

            const loadSavedAddress = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/util/address?postal=${allData.info_zipcode}`);
                    const data: AddressResponse[] = await res.json();

                    if (data && data.length > 0) {
                        setAddressOptions(data);

                        const uniqueProvinces = Array.from(new Set(data.map(d => d.province)));
                        setAvailableProvinces(uniqueProvinces);

                        if (allData.info_province) {
                            const filteredByProvince = data.filter(d => d.province === allData.info_province);
                            const uniqueDistricts = Array.from(new Set(filteredByProvince.map(d => d.district)));
                            setAvailableDistricts(uniqueDistricts);

                            if (allData.info_district) {
                                const subs = filteredByProvince.filter(d => d.district === allData.info_district).map(d => d.subdistrict);
                                setAvailableSubDistricts(subs);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to load address data:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            loadSavedAddress();
        }
    }, []);

    const onSubmit = (data: any) => {
        setAllData((prev: any) => ({...prev, ...data}));
        next();
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return "";
        const digits = value.replace(/\D/g, "");

        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-twilight-indigo-900 rounded-[40px] md:rounded-xl border border-twilight-indigo-800 shadow-sm overflow-hidden drop-shadow-xl drop-shadow-black/20"
            >
                {/* Personal Info */}
                <div className="p-6 md:p-8 gap-6 flex flex-col border-b border-twilight-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <h2 className="text-xl font-bold text-white">ข้อมูลส่วนตัว</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* คำนำหน้า */}
                        <FormField
                            control={form.control}
                            name="name_prefix"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel>
                                        <div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            คำนำหน้าชื่อ
                                            </div>
                                            </FormLabel>
                                    <Select data-clarity-mask="true" onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                <SelectValue placeholder="เลือก" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem className="py-3 px-4" value="เด็กชาย">เด็กชาย</SelectItem>
                                            <SelectItem className="py-3 px-4" value="เด็กหญิง">เด็กหญิง</SelectItem>
                                            <SelectItem className="py-3 px-4" value="นาย">นาย</SelectItem>
                                            {/*<SelectItem className="py-3 px-4" value="นาง">นาง</SelectItem>*/}
                                            <SelectItem className="py-3 px-4" value="นางสาว">นางสาว</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ชื่อจริง */}
                        <FormField
                            control={form.control}
                            name="name_first"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-5">
                                    <FormLabel>
                                        <div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ชื่อจริง
                                            </div>
                                            </FormLabel>
                                    <FormControl>
                                        <Input data-clarity-mask="true" className="py-6 px-4 rounded-xl" placeholder="ชื่อจริง" {...field}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\d/g, "");
                                            field.onChange(value);
                                        }}
                                        maxLength={100}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* นามสกุล */}
                        <FormField
                            control={form.control}
                            name="name_last"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-5">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            นามสกุล
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input data-clarity-mask="true" className="py-6 px-4 rounded-xl" placeholder="นามสกุล" {...field}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\d/g, "");
                                            field.onChange(value);
                                        }}
                                        maxLength={100}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสอง */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* ชื่อเล่น */}
                        <FormField
                            control={form.control}
                            name="name_nick"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ชื่อเล่น
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input data-clarity-mask="true" className="py-6 px-4 rounded-xl" placeholder="ชื่อเล่น" {...field} maxLength={100}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* วันเกิด */}
                        <FormField
                            control={form.control} // รับมาจาก useForm
                            name="info_dob" // ชื่อ field ใน schema (zod)
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            วันเดือนปีเกิด
                                            </div></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full relative rounded-xl py-6 px-4 text-left font-normal justify-start",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(addYears(field.value, 543), "d MMMM yyyy", { locale: th })
                                                    ) : (
                                                        <span className="pl-1">เลือกวันที่</span>
                                                    )}
                                                    <FontAwesomeIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" icon={faCakeCandles} />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date("2012-12-31") || date < new Date("2005-12-31")
                                                }
                                                locale={th}
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสาม */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* เพศ */}
                        <FormField
                            control={form.control}
                            name="info_gender"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">

                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            เพศกำเนิด
                                            </div></FormLabel>
                                    {/* ส่วนตัวเลือก Radio */}
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 gap-4 items-center"
                                        >
                                            {/* ชาย */}
                                            <FormItem>
                                                <label
                                                    htmlFor="gender-male"
                                                    className="group flex items-center space-x-3 space-y-0 px-4 py-3.5 rounded-xl border has-[:checked]:border-blue-300 has-[:checked]:bg-blue-300/5 transition-all cursor-pointer hover:bg-input/30"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem value="male" id="gender-male" />
                                                    </FormControl>
                                                    <span className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>ชาย</span>
                                                      <FontAwesomeIcon
                                                          className="absolute right-[-6] text-lg top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-has-[:checked]:text-blue-300"
                                                          icon={faChild}
                                                      />
                                                    </span>
                                                </label>
                                            </FormItem>

                                            {/* หญิง */}
                                            <FormItem>
                                                <label
                                                    htmlFor="gender-female"
                                                    className="group flex items-center space-x-3 space-y-0 px-4 py-3.5 rounded-xl border has-[:checked]:border-pink-300 has-[:checked]:bg-pink-300/5 transition-all cursor-pointer hover:bg-twilight-indigo-800/30"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem value="female" id="gender-female" />
                                                    </FormControl>
                                                    <span className="flex-1 relative items-center text-sm transition-colors">
                                                        <span>หญิง</span>

                                                        <FontAwesomeIcon className="absolute right-[-6] text-lg top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-has-[:checked]:text-pink-300" icon={faChildDress}/>
                                                    </span>
                                                </label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ศาสนา */}
                        <FormField
                            control={form.control}
                            name="info_religion"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ศาสนา
                                            </div></FormLabel>
                                    <Select data-clarity-mask="true" onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                <SelectValue placeholder="เลือกศาสนา" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem className="py-3 px-4" value="พุทธ"><FontAwesomeIcon icon={faDharmachakra} />พุทธ</SelectItem>
                                            <SelectItem className="py-3 px-4" value="คริสต์"><FontAwesomeIcon icon={faCross} />คริสต์</SelectItem>
                                            <SelectItem className="py-3 px-4" value="อิสลาม"><FontAwesomeIcon icon={faStarAndCrescent} />อิสลาม</SelectItem>
                                            <SelectItem className="py-3 px-4" value="ฮินดู"><FontAwesomeIcon icon={faOm} />ฮินดู</SelectItem>
                                            <SelectItem className="py-3 px-4" value="อื่น ๆ">อื่น ๆ</SelectItem>
                                            <SelectItem className="py-3 px-4" value="ไม่นับถือ">ไม่นับถือ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสี่ */ }
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                        {/* เบอร์โทรศัพท์ */}
                        <FormField
                            control={form.control}
                            name="info_phone"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            เบอร์โทรศัพท์
                                            </div></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FontAwesomeIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" icon={faPhone} />
                                            <Input
                                                data-clarity-mask="true"
                                                // Add 'pl-10' to make room for the icon on the left
                                                className="py-6 pl-4 pr-10 rounded-xl"
                                                placeholder="0XX-XXX-XXXX"

                                                {...field}
                                                value={formatPhoneNumber(field.value)}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, "");
                                                    if (rawValue.length <= 10) {
                                                        field.onChange(rawValue);
                                                    }
                                                }}

                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* อีเมล */}
                        <FormField
                            control={form.control}
                            name="info_email"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            อีเมล
                                            </div></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FontAwesomeIcon
                                                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                icon={faEnvelope}
                                            />
                                            {/* เปลี่ยนเป็น div แต่ใช้ Class เดิมที่คุณให้มาทั้งหมด */}
                                            <div
                                                className="opacity-50 border-input flex items-center min-w-0 border bg-muted/20 text-base shadow-xs transition-[color,box-shadow] md:text-sm py-3.5 px-4 pr-10 rounded-xl text-muted-foreground cursor-not-allowed"
                                            >
                                                {user?.email || "Loading..."}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="p-6 md:p-8 gap-6 flex flex-col">

                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                            <FontAwesomeIcon icon={faHouse}/>
                        </div>
                        <h2 className="text-xl font-bold">ที่อยู่ปัจจุบัน</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {/* รหัสไปรษณีย์ */}
                        <FormField
                            control={form.control}
                            name="info_zipcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel><div className="relative"><span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                        รหัสไปรษณีย์</div></FormLabel>
                                    <FormControl>
                                        <Input
                                            data-clarity-mask="true"

                                            className="py-6 px-4 rounded-xl"
                                            placeholder="XXXXX"
                                            {...field}
                                            value={field.value || ""}
                                            maxLength={5}
                                            onChange={(e) => {

                                                const onlyNumbers = e.target.value.replace(/\D/g, "");
                                                field.onChange(onlyNumbers);
                                                handleZipCodeChange(onlyNumbers);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* จังหวัด */}
                        <FormField
                            control={form.control}
                            name="info_province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel><div className="relative"><span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                        จังหวัด</div></FormLabel>
                                    {availableProvinces.length > 1 ? (
                                        <Select
                                            data-clarity-mask="true"
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                processDistricts(val, addressOptions);
                                            }}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={`py-6 px-4 w-full rounded-xl ${form.watch("info_province") === "" ? "border-theme-secondary" : ""} border-2`}>
                                                    <SelectValue placeholder="รหัสไปรษณีย์นี้มีหลายจังหวัด กรุณาเลือก" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableProvinces.map((p, i) => (
                                                    <SelectItem className="py-3 px-4" key={i} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <FormControl>
                                            <Input {...field} value={field.value || ""} readOnly data-clarity-mask="true" className="py-6 px-4 rounded-xl bg-gray-100" placeholder="กรุณาระบุรหัสไปรษณีย์ก่อน" />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* เขต/อำเภอ */}
                        <FormField
                            control={form.control}
                            name="info_district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div className="relative"><span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            {districtLabel}</div></FormLabel>
                                    {availableDistricts.length > 1 ? (
                                        <Select
                                            data-clarity-mask="true"
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                processSubDistricts(val, addressOptions.filter(d => d.province === form.watch("info_province")));
                                            }}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="py-6 px-4 w-full rounded-xl">
                                                    <SelectValue placeholder={`เลือก${districtLabel}`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableDistricts.map((d, i) => (
                                                    <SelectItem className="py-3 px-4" key={i} value={d}>{d}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <FormControl>
                                            <Input {...field} value={field.value || ""} readOnly data-clarity-mask="true" className="py-6 px-4 rounded-xl bg-gray-100" placeholder={availableProvinces.length > 1 ? "กรุณาระบุจังหวัดก่อน" : "กรุณาระบุรหัสไปรษณีย์ก่อน"} />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* แขวง/ตำบล */}
                        <FormField
                            control={form.control}
                            name="info_sub_district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel><div className="relative"><span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                        {subDistrictLabel}</div></FormLabel>

                                    {availableSubDistricts.length > 1 ? (
                                        <Select data-clarity-mask="true" onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger className="py-6 px-4 w-full rounded-xl">
                                                    <SelectValue placeholder={`เลือก${subDistrictLabel}`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableSubDistricts.map((sub, i) => (
                                                    <SelectItem className="py-3 px-4" key={i} value={sub}>{sub}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ""}
                                                readOnly
                                                data-clarity-mask="true"
                                                className="py-6 px-4 rounded-xl bg-gray-100"
                                                placeholder={`กรุณาระบุ${subDistrictLabel}ก่อน`}
                                            />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="info_address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel><div className="relative">
                                        <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                        บ้านเลขที่, ซอย, หมู่, ถนน
                                    </div></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            data-clarity-mask="true"

                                            placeholder=""
                                            className="resize-none rounded-xl py-3 px-4 h-20"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="p-6 md:p-8 border-t border-twilight-indigo-800 bg-twilight-indigo-900/50 flex flex-col sm:flex-row-reverse justify-between gap-4">
                    <Button
                        type="submit"
                        className="px-8 py-5 font-bold rounded-xl bg-primary hover:bg-primary/90 focus:ring-offset-twilight-indigo-900"
                        //onClick={onSubmit}
                    >
                        ถัดไป
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </Button>
                    { (studentStatus?.std_status_info_done == true) && (
                    <Button
                        type="button"
                        className="px-4 py-5 font-bold rounded-xl  bg-twilight-indigo-900 text-white hover:bg-twilight-indigo-700 focus:ring-offset-twilight-indigo-900"
                        onClick={() => router.push('/application')}
                    >
                        ยกเลิก
                    </Button>
                    )
                    }

                </div>
            </form>
        </Form>
    );
}

function Step2() {
    const {prev, next, setAllData, allData, step, saveToLocal} = useContext(RegisterCtx);
    const { user } = useUser();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(Step2Schema) as any,
        defaultValues: {
            name_prefix: allData?.name_prefix || "",
            name_first: allData?.name_first || "",
            name_last: allData?.name_last || "",
            name_nick: allData?.name_nick || "",

            info_dob: allData?.info_dob || undefined,
            info_gender: allData?.info_gender || "",
            info_religion: allData?.info_religion || "",
            info_phone: allData?.info_phone || "",

            info_zipcode: allData?.info_zipcode || "",
            info_province: allData?.info_province || "",
            info_district: allData?.info_district || "",
            info_sub_district: allData?.info_sub_district || "",
            info_address: allData?.info_address || "",

            academic_level: allData?.academic_level || "",
            academic_program: allData?.academic_program || "",
            academic_program_other: allData?.academic_program_other || "",
            academic_school: allData?.academic_school || "",

            grade_gpax: allData?.grade_gpax || "",
            grade_math: allData?.grade_math || "",
            grade_sci: allData?.grade_sci || "",
            grade_eng: allData?.grade_eng || "",

            health_bloodType: allData?.health_bloodType || "",
            health_medicalRights: allData?.health_medicalRights || "",
            health_chronicDiseases: allData?.health_chronicDiseases || "",
            health_drugAllergies: allData?.health_drugAllergies || "",
            health_dietaryRestrictions: allData?.health_dietaryRestrictions || "",
            health_more: allData?.health_more || "",

            guardian_name: allData?.guardian_name || "",
            guardian_relationship: allData?.guardian_relationship || "",
            guardian_phone: allData?.guardian_phone || "",

            availability_haveAttended: allData?.availability_haveAttended || "",
            availability_attendAllDays: allData?.availability_attendAllDays || "",
            availability_laptop: allData?.availability_laptop || "",
            availability_laptopOS: allData?.availability_laptopOS || "",
            availability_laptopOS_other: allData?.availability_laptopOS_other || "",
            availability_tablet: allData?.availability_tablet || "",
            availability_mouse: allData?.availability_mouse || "",
            availability_travelPlan: allData?.availability_travelPlan || "",

            apparel_size: allData?.apparel_size || "",
        },
    })

    useEffect(() => {
        const { unsubscribe } = form.watch((values, { type }) => {
            setAllData((prev: any) => {
                const newData = { ...prev, ...values }

                if (type) {
                    saveToLocal(newData, step)
                }

                return newData;
            });
        });
        return unsubscribe;
    }, [form.watch, setAllData, step, saveToLocal]);

    const onSubmit = (data: any) => {
        setAllData((prev: any) => ({...prev, ...data}));
        next();
    };

    const onPrev = () => {
        const currentValues = form.getValues();
        setAllData((prevData: any) => ({ ...prevData, ...currentValues }));
        prev();
    };

    const formatGPAX = (value: string) => {
        if (!value) return "";
        // Remove all non-digits
        const digits = value.replace(/\D/g, "");

        // If only 1 digit: add the dot immediately (e.g., "4" -> "4.")
        if (digits.length === 1) return `${digits}.`;

        // If 2 or more digits: format as X.XX (e.g., "35" -> "3.5", "350" -> "3.50")
        // We slice to 3 digits total to keep the GPAX scale correct
        const cappedDigits = digits.slice(0, 3);
        return `${cappedDigits.slice(0, 1)}.${cappedDigits.slice(1)}`;
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-twilight-indigo-900 rounded-[40px] md:rounded-xl border border-twilight-indigo-800 shadow-sm overflow-hidden drop-shadow-xl drop-shadow-black/20"
            >
                {/* Academic Information Section */}
                <div className="p-6 md:p-8 border-b border-twilight-indigo-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                            <FontAwesomeIcon icon={faGraduationCap} />
                        </div>
                        <h2 className="text-xl font-bold text-white">ข้อมูลการศึกษา</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* ระดับชั้นการศึกษา */}
                        <FormField
                            control={form.control}
                            name="academic_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ระดับชั้นการศึกษา
                                            </div> <span className="opacity-40">(ปีการศึกษา 2568)</span></FormLabel>
                                    <Select data-clarity-mask="true" onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                <SelectValue placeholder="เลือกระดับชั้น" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem className="py-3 px-4" value="มัธยมศึกษาปีที่ 4">มัธยมศึกษาปีที่ 4</SelectItem>
                                            <SelectItem className="py-3 px-4" value="มัธยมศึกษาปีที่ 5">มัธยมศึกษาปีที่ 5</SelectItem>
                                            <SelectItem className="py-3 px-4" value="ปวช. 1">ปวช. 1</SelectItem>
                                            <SelectItem className="py-3 px-4" value="ปวช. 2">ปวช. 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* สายการเรียน */}
                        <div className="flex flex-row gap-5 items-start">
                            <FormField
                                control={form.control}
                                name="academic_program"
                                render={({ field }) => (
                                    <FormItem className={form.watch("academic_program") === "อื่น ๆ" ? "w-auto" : "w-full"}>
                                        <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            แผนการเรียน
                                            </div></FormLabel>
                                        <Select data-clarity-mask="true" onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                    <SelectValue placeholder="เลือก" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem className="py-3 px-4" value="วิทยาศาสตร์-คณิตศาสตร์">วิทยาศาสตร์-คณิตศาสตร์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="คณิตศาสตร์-คอมพิวเตอร์">คณิตศาสตร์-คอมพิวเตอร์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="วิทยาศาสตร์-คอมพิวเตอร์">วิทยาศาสตร์-คอมพิวเตอร์</SelectItem>

                                                <SelectItem className="py-3 px-4" value="ปวช. สาขาคอมพิวเตอร์ธุรกิจ">ปวช. สาขาคอมพิวเตอร์ธุรกิจ</SelectItem>
                                                <SelectItem className="py-3 px-4" value="ปวช. สาขาช่างไฟฟ้ากำลัง (อิเล็กทรอนิกส์)">ปวช. สาขาช่างไฟฟ้ากำลัง (อิเล็กทรอนิกส์)</SelectItem>
                                                <SelectItem className="py-3 px-4" value="ปวช. สาขาเมคคาทรอนิกส์และหุ่นยนต์">ปวช. สาขาเมคคาทรอนิกส์และหุ่นยนต์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="อื่น ๆ">อื่น ๆ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.watch("academic_program") === "อื่น ๆ" && (
                                <FormField
                                    control={form.control}
                                    name="academic_program_other"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>โปรดระบุแผนการเรียน</FormLabel>
                                            <FormControl>
                                                <Input
                                                    data-clarity-mask="true"
                                                    className="py-6 px-4 rounded-xl border-blue-400 focus:ring-blue-500"
                                                    placeholder="เช่น ศิลป์-คำนวณ"
                                                    {...field}
                                                    maxLength={100}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* ชื่อสถาบันการศึกษา */}
                        <FormField
                            control={form.control}
                            name="academic_school"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ชื่อสถาบันการศึกษา
                                            </div></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                        <SchoolInput
                                            data-clarity-mask="true"
                                            className="py-6 px-4 pr-10 rounded-xl"
                                            {...field}

                                            placeholder="ชื่อสถาบันการศึกษาของคุณ"

                                        />
                                        <FontAwesomeIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" icon={faSchool} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="items-center gap-3 mt-10">
                        <h2 className="col-span-1 text-lg font-bold text-white">
                                            ผลการเรียน
                                            </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 items-start">
                        {/* GPAX */}
                        <FormField
                            control={form.control}
                            name="grade_gpax"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ผลการเรียนเฉลี่ยสะสม (GPAX)
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input
                                            data-clarity-mask="true"
                                            className="py-6 pl-4 pr-10 rounded-xl"
                                            placeholder="0.00"
                                            inputMode="decimal"
                                            {...field}
                                            onChange={(e) => {
                                                const isDeleting = (e.nativeEvent as InputEvent).inputType?.includes("delete");
                                                const digits = e.target.value.replace(/\D/g, "");


                                                if (isDeleting && digits.length <= 1) {
                                                    field.onChange(digits);
                                                    return;
                                                }

                                                let formatted = "";
                                                if (digits.length === 1) {
                                                    formatted = `${digits}.`;
                                                } else if (digits.length > 1) {
                                                    const capped = digits.slice(0, 3);
                                                    formatted = `${capped[0]}.${capped.slice(1)}`;
                                                }

                                                if (parseFloat(formatted) > 4.00 || (digits[0] === "4" && !isDeleting)) {
                                                    field.onChange("4.00");
                                                } else {
                                                    field.onChange(formatted || digits);
                                                }
                                            }}

                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="grade_math"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            คณิตศาสตร์
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input
                                            data-clarity-mask="true"
                                            className="py-6 pl-4 pr-10 rounded-xl"
                                            placeholder="0.00"
                                            inputMode="decimal"
                                            {...field}
                                            onChange={(e) => {
                                                const isDeleting = (e.nativeEvent as InputEvent).inputType?.includes("delete");
                                                const digits = e.target.value.replace(/\D/g, "");

                                                if (isDeleting && digits.length <= 1) {
                                                    field.onChange(digits);
                                                    return;
                                                }

                                                let formatted = "";
                                                if (digits.length === 1) {
                                                    formatted = `${digits}.`;
                                                } else if (digits.length > 1) {
                                                    const capped = digits.slice(0, 3);
                                                    formatted = `${capped[0]}.${capped.slice(1)}`;
                                                }

                                                if (parseFloat(formatted) > 4.00 || (digits[0] === "4" && !isDeleting)) {
                                                    field.onChange("4.00");
                                                } else {
                                                    field.onChange(formatted || digits);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="grade_sci"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            วิทยาศาสตร์
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input
                                            data-clarity-mask="true"
                                            className="py-6 pl-4 pr-10 rounded-xl"
                                            placeholder="0.00"
                                            inputMode="decimal"
                                            {...field}
                                            onChange={(e) => {
                                                const isDeleting = (e.nativeEvent as InputEvent).inputType?.includes("delete");
                                                const digits = e.target.value.replace(/\D/g, "");

                                                if (isDeleting && digits.length <= 1) {
                                                    field.onChange(digits);
                                                    return;
                                                }

                                                let formatted = "";
                                                if (digits.length === 1) {
                                                    formatted = `${digits}.`;
                                                } else if (digits.length > 1) {
                                                    const capped = digits.slice(0, 3);
                                                    formatted = `${capped[0]}.${capped.slice(1)}`;
                                                }

                                                if (parseFloat(formatted) > 4.00 || (digits[0] === "4" && !isDeleting)) {
                                                    field.onChange("4.00");
                                                } else {
                                                    field.onChange(formatted || digits);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="grade_eng"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ภาษาอังกฤษ
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input
                                            data-clarity-mask="true"
                                            className="py-6 pl-4 pr-10 rounded-xl"
                                            placeholder="0.00"
                                            inputMode="decimal"
                                            {...field}
                                            onChange={(e) => {
                                                const isDeleting = (e.nativeEvent as InputEvent).inputType?.includes("delete");
                                                const digits = e.target.value.replace(/\D/g, "");

                                                if (isDeleting && digits.length <= 1) {
                                                    field.onChange(digits);
                                                    return;
                                                }

                                                let formatted = "";
                                                if (digits.length === 1) {
                                                    formatted = `${digits}.`;
                                                } else if (digits.length > 1) {
                                                    const capped = digits.slice(0, 3);
                                                    formatted = `${capped[0]}.${capped.slice(1)}`;
                                                }

                                                if (parseFloat(formatted) > 4.00 || (digits[0] === "4" && !isDeleting)) {
                                                    field.onChange("4.00");
                                                } else {
                                                    field.onChange(formatted || digits);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </div>

                {/* Medical History Section */}
                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-red-500">
                            <FontAwesomeIcon icon={faBriefcaseMedical}/>
                        </div>
                        <h2 className="text-xl font-bold">ข้อมูลสุขภาพ</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Blood Type (ปรับเป็น RadioGroup ของ shadcn) */}
                        <FormField
                            control={form.control}
                            name="health_bloodType"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            หมู่เลือด
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap gap-4"
                                        >
                                            {["A", "B", "O", "AB", "ไม่ทราบ"].map((type) => (
                                                <div key={type} className="flex items-center">
                                                    <RadioGroupItem value={type} id={`blood-${type}`} className="peer sr-only" />
                                                    <Label
                                                        htmlFor={`blood-${type}`}
                                                        className="font-bold px-5 py-3 rounded-xl border cursor-pointer peer-data-[state=checked]:bg-red-600 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:shadow-glow-red transition-all hover:not-peer-data-[state=checked]:bg-input/30"
                                                    >
                                                        {type}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ข้อมูลทางการแพทย์อื่น ๆ */}
                        {[
                            { id: "health_medicalRights", label: "สิทธิการรักษาพยาบาล", placeholder: "เช่น บัตรทอง" },
                            { id: "health_chronicDiseases", label: "โรคประจำตัว", placeholder: "ระบุโรคประจำตัวของคุณ (หากไม่มีให้ระบุว่า \"-\")", area: true },
                            { id: "health_drugAllergies", label: "การแพ้ยา", placeholder: "ระบุชื่อยาที่แพ้ และอาการที่เกิดขึ้น เช่น ผื่นคัน, หายใจลำบาก (หากไม่มีให้ระบุว่า \"-\")", area: true },
                            { id: "health_dietaryRestrictions", label: "ข้อจำกัดด้านอาหาร", placeholder: "เช่น แพ้อาหาร มังสวิรัติ ไม่ทานเผ็ด ประเภทอาหารที่สามารถทานได้ (หากไม่มีให้ระบุว่า \"-\")", area: true },
                            { id: "health_more", label: "รายละเอียดเพิ่มเติม", placeholder: "ข้อมูลเพิ่มเติมเกี่ยวกับสุขภาพ และความปลอดภัย (ถ้ามี)", area: true, notreq: true }
                        ].map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name={item.id as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {!item.notreq ?
                                                (<div className="relative"><span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>{item.label}</div>
                                            ) : (
                                                    <div>{item.label} <span className="opacity-40">(ถ้ามี)</span></div>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            {item.area ? (
                                                <Textarea data-clarity-mask="true" className="py-3 px-4 rounded-xl" placeholder={item.placeholder} rows={2} {...field} maxLength={210} />
                                            ) : (
                                                <Input data-clarity-mask="true" className="py-6 px-4 rounded-xl" placeholder={item.placeholder} {...field} maxLength={105} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="p-6 md:p-8 border-t border-twilight-indigo-800 bg-twilight-indigo-900/50 flex flex-col-reverse sm:flex-row justify-between gap-4">
                    <Button
                        type="button"
                        className="px-8 py-5 font-bold rounded-xl border border-twilight-indigo-800 bg-twilight-indigo-900 text-white hover:bg-twilight-indigo-700 focus:ring-offset-twilight-indigo-900"
                        onClick={onPrev}
                    >
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        ย้อนกลับ
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 py-5 font-bold rounded-xl bg-primary hover:bg-primary/90 focus:ring-offset-twilight-indigo-900"
                        //onClick={onSubmit}
                    >
                        ถัดไป
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </Button>
                </div>
            </form>
        </Form>
    )
}

function calculateAge(birthDateString: string | Date) {
    const today = new Date();
    const birthDate = new Date(birthDateString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust if the birthday hasn't happened yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function Step3() {
    const {prev, next, setAllData, allData, step, saveToLocal} = useContext(RegisterCtx);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const { applicationId, isLoadingApp, refreshApplication } = useStudent();
    const router = useRouter();

    const toBool = (val: boolean | string) => val === "true" || val === true || val === false;

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(Step3Schema) as any,
        defaultValues: {
            name_prefix: allData?.name_prefix || "",
            name_first: allData?.name_first || "",
            name_last: allData?.name_last || "",
            name_nick: allData?.name_nick || "",

            info_dob: allData?.info_dob || undefined,
            info_gender: allData?.info_gender || "",
            info_religion: allData?.info_religion || "",
            info_phone: allData?.info_phone || "",

            info_zipcode: allData?.info_zipcode || "",
            info_province: allData?.info_province || "",
            info_district: allData?.info_district || "",
            info_sub_district: allData?.info_sub_district || "",
            info_address: allData?.info_address || "",

            academic_level: allData?.academic_level || "",
            academic_program: allData?.academic_program || "",
            academic_program_other: allData?.academic_program_other || "",
            academic_school: allData?.academic_school || "",

            grade_gpax: allData?.grade_gpax || "",
            grade_math: allData?.grade_math || "",
            grade_sci: allData?.grade_sci || "",
            grade_eng: allData?.grade_eng || "",

            health_bloodType: allData?.health_bloodType || "",
            health_medicalRights: allData?.health_medicalRights || "",
            health_chronicDiseases: allData?.health_chronicDiseases || "",
            health_drugAllergies: allData?.health_drugAllergies || "",
            health_dietaryRestrictions: allData?.health_dietaryRestrictions || "",
            health_more: allData?.health_more || "",

            guardian_name: allData?.guardian_name || "",
            guardian_relationship: allData?.guardian_relationship || "",
            guardian_phone: allData?.guardian_phone || "",

            availability_haveAttended: allData?.availability_haveAttended || "",
            availability_attendAllDays: allData?.availability_attendAllDays || "",
            availability_laptop: allData?.availability_laptop || "",
            availability_laptopOS: allData?.availability_laptopOS || "",
            availability_laptopOS_other: allData?.availability_laptopOS_other || "",
            availability_tablet: allData?.availability_tablet || "",
            availability_mouse: allData?.availability_mouse || "",
            availability_travelPlan: allData?.availability_travelPlan || "",

            apparel_size: allData?.apparel_size || "",
        },
    })

    useEffect(() => {
        const { unsubscribe } = form.watch((values, { type }) => {
            setAllData((prev: any) => {
                const newData = { ...prev, ...values }

                if (type) {
                    saveToLocal(newData, step)
                }

                return newData;
            });
        });
        return unsubscribe;
    }, [form.watch, setAllData, step, saveToLocal]);

    const onSubmit = async () => {
        console.log("ส่งข้อมูลทั้งหมดไป API:", allData);
        setLoading(true);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/info/${applicationId}`,
                {
                    prefix: allData.name_prefix,
                    first_name: allData.name_first,
                    last_name: allData.name_last,
                    nick_name: allData.name_nick,
                    age: calculateAge(allData.info_dob),
                    birthdate: format(new Date(allData.info_dob), 'yyyy-MM-dd'),
                    gender: allData.info_gender,
                    religion: allData.info_religion,
                    phone_number: allData.info_phone,
                    education_level: allData.academic_level,
                    education_institute: allData.academic_school,
                    education_plan: allData.academic_program === "อื่น ๆ" ? allData.academic_program_other : allData.academic_program,
                    grade_gpax: allData.grade_gpax,
                    grade_math: allData.grade_math,
                    grade_sci: allData.grade_sci,
                    grade_eng: allData.grade_eng,
                    parent_fullname: allData.guardian_name,
                    parent_relation: allData.guardian_relationship,
                    parent_phone_number: allData.guardian_phone,
                    have_participated: toBool(allData.availability_haveAttended),
                    have_laptop: toBool(allData.availability_laptop),
                    can_participate_every_day: toBool(allData.availability_attendAllDays),
                    medical_insurance: allData.health_medicalRights,
                    chronic_disease: `${allData.health_chronicDiseases} รายละเอียดเพิ่มเติม "${allData.health_more}"` ,
                    drug_allergy: allData.health_drugAllergies,
                    food_allergy: allData.health_dietaryRestrictions,
                    blood_group: allData.health_bloodType,
                    address: `${allData.info_address} ${allData.info_province === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}${allData.info_sub_district} ${allData.info_province === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}${allData.info_district} จังหวัด${allData.info_province} ${allData.info_zipcode}`,

                    shirt_size: allData.apparel_size,
                    travel_plan: allData.availability_travelPlan,
                    laptop_os: allData.availability_laptop === "false"
                        ? "ไม่สะดวกนำมา"
                        : allData.availability_laptopOS === "Linux"
                            ? `Linux (${allData.availability_laptopOS_other})`
                            : allData.availability_laptopOS === "อื่น ๆ"
                                ? `อื่น ๆ: ${allData.availability_laptopOS_other}`
                                : allData.availability_laptopOS,
                    have_tablet: toBool(allData.availability_tablet),
                    have_mouse: toBool(allData.availability_mouse)
                },
                { withCredentials: true }
            );

            // 5. *สำคัญมาก* บอก Context ให้เช็คสถานะใหม่ (เพื่อให้ติ๊กถูกสีเขียวขึ้นที่หน้า Dashboard)
            await refreshApplication();

            // เด้งกลับไปหน้า Dashboard หรือหน้าถัดไป
            localStorage.removeItem("comcamp37_reg_input");
            router.push("/application");
        } catch (error: any) {
            toast.error("บันทึกไม่สำเร็จ โปรดลองใหม่", {
                position: "bottom-right",
                description: error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ (" + (error.code || "Unknown") + ")",
            });
        } finally {
            setLoading(false);
        }
    };

    const onPrev = () => {
        const currentValues = form.getValues();

        setAllData((prevData: any) => ({ ...prevData, ...currentValues }));

        prev();
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return "";
        const digits = value.replace(/\D/g, "");

        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-twilight-indigo-900 rounded-[40px] md:rounded-xl border border-twilight-indigo-800 shadow-sm overflow-hidden drop-shadow-xl drop-shadow-black/20"
            >
                {/* Personal Info */}
                <div className="p-6 md:p-8 gap-6 flex flex-col flex-col border-b border-twilight-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                            <FontAwesomeIcon icon={faPersonBreastfeeding} />
                        </div>
                        <h2 className="text-xl font-bold text-white">ข้อมูลติดต่อผู้ปกครอง</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* ชื่อผู้ปกครอง */}
                        <FormField
                            control={form.control}
                            name="guardian_name"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ชื่อผู้ปกครอง
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input data-clarity-mask="true" className="py-6 px-4 rounded-xl" placeholder="นายห่านน้อย คอยรัก" {...field}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\d/g, "");
                                            field.onChange(value);
                                        }}
                                        maxLength={100}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* คสพผปค */}
                        <FormField
                            control={form.control}
                            name="guardian_relationship"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ความสัมพันธ์กับผู้ปกครอง
                                            </div></FormLabel>
                                    <FormControl>
                                        <Input data-clarity-mask="true" className="py-6 px-4 rounded-xl" placeholder="เช่น บิดา มารดา" {...field} maxLength={100}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสอง */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* เบอร์โทรศัพท์ผู้ปกครอง */}
                        <FormField
                            control={form.control}
                            name="guardian_phone"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            เบอร์ติดต่อผู้ปกครอง
                                            </div></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FontAwesomeIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" icon={faPhone} />
                                            <Input
                                                data-clarity-mask="true"
                                                // Add 'pl-10' to make room for the icon on the left
                                                className="py-6 pl-4 pr-10 rounded-xl"
                                                placeholder="0XX-XXX-XXXX"
                                                {...field}
                                                value={formatPhoneNumber(field.value)}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, "");
                                                    if (rawValue.length <= 10) {
                                                        field.onChange(rawValue);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="p-6 md:p-8 gap-6 flex flex-col border-b border-twilight-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800">
                            <FontAwesomeIcon icon={faBoxArchive}/>
                        </div>
                        <h2 className="text-xl font-bold">ความพร้อมและการเดินทาง</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 items-start">
                        {/* เคยเข้า ComCamp ไหม */}
                        <FormField
                            control={form.control}
                            name="availability_haveAttended"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            เคยเข้าร่วม ComCamp ไหม
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row gap-10 items-center mt-1"
                                        >
                                            {/* ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_haveAttended-yes"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer w-18"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="true" id="availability_haveAttended-yes"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>เคย</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                            {/* ไม่ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_haveAttended-no"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="false" id="availability_haveAttended-no"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>ไม่เคย</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* สะดวกเข้าร่วมทุกวันไหม */}
                        <FormField
                            control={form.control}
                            name="availability_attendAllDays"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            สะดวกพักค้างคืนตลอดโครงการไหม
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row gap-10 items-center mt-1"
                                        >
                                            {/* ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_attendAllDays-yes"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer w-18"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="true" id="availability_attendAllDays-yes"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                            {/* ไม่ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_attendAllDays-no"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="false" id="availability_attendAllDays-no"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>ไม่สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        { /* สะดวกนำ iPad/Tablet มาไหม */}
                        <FormField
                            control={form.control}
                            name="availability_tablet"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            สะดวกนำ Tablet มาไหม
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row gap-10 items-center mt-1"
                                        >
                                            {/* ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_tablet-yes"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer w-18"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="true" id="availability_tablet-yes"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                            {/* ไม่ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_tablet-no"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="false" id="availability_tablet-no"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>ไม่สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        { /* สะดวกนำ laptop มาไหม */}
                        <FormField
                            control={form.control}
                            name="availability_laptop"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            สะดวกนำ Laptop มาไหม
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row gap-10 items-center mt-1"
                                        >
                                            {/* ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_laptop-yes"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer w-18"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="true" id="availability_laptop-yes"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                            {/* ไม่ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_laptop-no"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="false" id="availability_laptop-no"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>ไม่สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        { /* สะดวกนำเมาส์มาไหม */}
                        <FormField
                            control={form.control}
                            name="availability_mouse"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            สะดวกนำเมาส์มาไหม
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-row gap-10 items-center mt-1"
                                        >
                                            {/* ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_mouse-yes"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer w-18"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="true" id="availability_mouse-yes"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                            {/* ไม่ใช่ */}
                                            <FormItem>
                                                <label
                                                    htmlFor="availability_mouse-no"
                                                    className="group flex items-center space-x-3 space-y-0 cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            className="cursor-pointer brightness-200 w-5 h-5"
                                                            value="false" id="availability_mouse-no"/>
                                                    </FormControl>
                                                    <span
                                                        className="flex-1 relative items-center text-sm transition-colors">
                                                      <span>ไม่สะดวก</span>
                                                    </span>
                                                </label>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        { /* Laptop OS */ }
                        {form.watch("availability_laptop") === "true" && (
                        <div className="flex flex-row gap-5 items-start">
                            <FormField
                                control={form.control}
                                name="availability_laptopOS"
                                render={({ field }) => (
                                    <FormItem className={(form.watch("availability_laptop") === "true") && ((form.watch("availability_laptopOS") === "อื่น ๆ" || form.watch("availability_laptopOS") === "Linux")) ? "w-auto" : "w-full"}>
                                        <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            ระบบปฏิบัติการ (OS)
                                            </div></FormLabel>
                                        <Select data-clarity-mask="true" disabled={form.watch("availability_laptop") === "false"} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                    <SelectValue placeholder="เลือก" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem className="py-3 px-4" value="Windows 11"><FontAwesomeIcon icon={faMicrosoft} />Windows 11</SelectItem>
                                                <SelectItem className="py-3 px-4" value="Windows 10"><FontAwesomeIcon icon={faWindows} />Windows 10</SelectItem>
                                                <SelectItem className="py-3 px-4" value="macOS"><FontAwesomeIcon icon={faApple} />macOS</SelectItem>
                                                <SelectItem className="py-3 px-4" value="Linux"><FontAwesomeIcon icon={faLinux} />Linux</SelectItem>
                                                <SelectItem className="py-3 px-4" value="อื่น ๆ">อื่น ๆ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {((form.watch("availability_laptop") === "true")&&(form.watch("availability_laptopOS") === "อื่น ๆ" || form.watch("availability_laptopOS") === "Linux")) && (
                                <FormField
                                    control={form.control}
                                    name="availability_laptopOS_other"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{form.watch("availability_laptopOS") === "Linux" ? "Distro" : "โปรดระบุ"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    data-clarity-mask="true"

                                                    className="py-6 px-4 rounded-xl border-blue-400 focus:ring-blue-500"
                                                    placeholder=""
                                                    {...field}
                                                    maxLength={100}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        )}

                        { /* วิธีการเดินทางมาค่าย */}
                        <span className="md:col-span-2 flex flex-col gap-y-3">
                        <FormField
                            control={form.control}
                            name="availability_travelPlan"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            วิธีการเดินทางมาค่าย
                                            </div></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            data-clarity-mask="true"

                                            placeholder="โปรดระบุวิธีการเดินทางมายังค่าย"
                                            className="resize-none rounded-xl py-3 px-4 h-20"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <p className="md:col-span-2 text-xs text-[#94a3b8]">
                                เขียนอธิบายวิธีการมาค่ายของน้อง ทั้งนี้เพื่อให้พี่ค่ายสามารถวางแผนการอำนวยความสะดวกให้น้องได้อย่างเต็มที่
                            <br/>
                            <br/>
                            ตัวอย่าง เดินทางจากบ้านพักด้วยรถโดยสารประจำทางสาย 75 ลงป้ายหน้ามหาวิทยาลัยฯ
                        </p>
                        </span>
                    </div>
                </div>
                <div className="p-6 md:p-8 gap-6 flex flex-col border-b border-twilight-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800">
                            <FontAwesomeIcon icon={faShirt}/>
                        </div>
                        <h2 className="text-xl font-bold">ขนาดเสื้อค่าย</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="overflow-hidden rounded-xl border border-twilight-indigo-700/50">
                            <table className="w-full text-sm text-left">
                                <thead
                                    className="bg-twilight-indigo-800/80 text-[#111418] text-white font-semibold">
                                <tr>
                                    <th className="px-4 py-3">ขนาด</th>
                                    <th className="px-4 py-3">อก (นิ้ว)</th>
                                    <th className="px-4 py-3">ยาว (นิ้ว)</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-twilight-indigo-700/50">
                                {[
                                    { size: "S", chest: "34", length: "25" },
                                    { size: "M", chest: "38", length: "27.5" },
                                    { size: "L", chest: "42", length: "28.5" },
                                    { size: "XL", chest: "44", length: "29.5" },
                                    { size: "2XL", chest: "46", length: "30" },
                                    { size: "3XL", chest: "50", length: "30.5" },
                                    { size: "4XL", chest: "52", length: "31" },
                                    { size: "5XL", chest: "56", length: "31.5" },
                                    { size: "6XL", chest: "60", length: "31.5" },
                                ].map((item) => (
                                    <tr key={item.size} data-selected={item.size == form.getValues('apparel_size') ? 'true' : ''} className="bg-twilight-indigo-800/20 data-[selected=true]:bg-twilight-indigo-700 transition-colors">
                                        <td className="px-4 py-2 font-medium">{item.size}</td>
                                        <td className="px-4 py-2 text-gray-400">{item.chest}</td>
                                        <td className="px-4 py-2 text-gray-400">{item.length}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        { /* ขนาดเสื้อค่าย */}
                        <FormField
                            control={form.control}
                            name="apparel_size"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-4">
                                    <FormLabel><div className="relative">
                                            <span className="absolute text-red-500 text-xs -left-[8px] -top-[0.5px]">*</span>
                                            เลือกขนาดเสื้อค่าย
                                            </div></FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            data-clarity-mask="true"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-5 gap-3"
                                        >
                                            {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"].map((type) => (
                                                <div key={type} className="peer sr-onl">
                                                    <RadioGroupItem value={type} id={`apparel_size-${type}`} className="peer sr-only" />
                                                    <Label
                                                        htmlFor={`apparel_size-${type}`}
                                                        className="font-bold text-center justify-center px-5 py-4 rounded-xl border cursor-pointer peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-twilight-indigo-900 peer-data-[state=checked]:border-white peer-data-[state=checked]:shadow-grow-white transition-all hover:not-peer-data-[state=checked]:bg-input/30"
                                                    >
                                                        {type}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div
                    className="p-6 md:p-8 border-t border-twilight-indigo-800 bg-twilight-indigo-900/50 flex flex-col-reverse sm:flex-row justify-between gap-4">
                    <Button
                        type="button"
                        className="px-8 py-5 font-bold rounded-xl border border-twilight-indigo-800 bg-twilight-indigo-900 text-white hover:bg-twilight-indigo-700 focus:ring-offset-twilight-indigo-900"
                        onClick={onPrev}
                    >
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        ย้อนกลับ
                    </Button>
                    <Button
                        disabled={loading}
                        type="submit"
                        className="px-8 py-5 font-bold rounded-xl bg-primary hover:bg-primary/90 focus:ring-offset-twilight-indigo-900"
                        //onClick={onSubmit}
                    >

                        {loading ? (<>กำลังบันทึก <Spinner/></>) : (<>บันทึก <FontAwesomeIcon icon={faFloppyDisk}/></>)}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
