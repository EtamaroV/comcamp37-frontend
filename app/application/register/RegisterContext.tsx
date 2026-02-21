"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema, Step2Schema, Step3Schema, FormData } from "./schema";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faArrowRight, faBoxArchive,
    faBriefcaseMedical, faCakeCandles, faCalendar, faChild, faChildDress, faCross, faDharmachakra, faEnvelope,
    faFloppyDisk,
    faFolderOpen,
    faGraduationCap, faOm, faPersonBreastfeeding, faPhone, faSchool, faShirt, faStarAndCrescent, faUser
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
import { format } from "date-fns"
import {useStudent, StudentInfo} from "@/contexts/StudentContext";
import {faApple, faLinux, faMicrosoft, faWindows} from "@fortawesome/free-brands-svg-icons";
import {useUser} from "@/contexts/UserContext";

export interface RegisterFormValues {
    name_prefix: string;
    name_first: string;
    name_last: string;
    name_nick: string;
    info_dob: Date | undefined;
    info_gender: "male" | "female";
    info_religion: string;
    info_phone: string;
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
    health_bloodType: "A" | "B" | "AB" | "O";

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
    const { studentInfo } = useStudent();
    const { user } = useUser();

    useEffect(() => {
        const safeDecode = (value: any) => {
            if (!value || typeof value !== 'string') return value || "";
            try { return decodeURIComponent(value); } catch (e) { return value; }
        };

        const mapDbToForm = (info: StudentInfo): Partial<RegisterFormValues> => {
            const dbPlan = safeDecode(info.std_info_education_plan);

            const standardPrograms = [
                "วิทยาศาสตร์-คณิตศาสตร์",
                "คณิตศาสตร์-คอมพิวเตอร์",
                "วิทยาศาสตร์-คอมพิวเตอร์",
                "คณิตศาสตร์-ภาษาอังกฤษ (ศิลป์-คำนวณ)",
                "ปวช. สาขาคอมพิวเตอร์ธุรกิจ",
                "ปวช. สาขาช่างไฟฟ้ากำลัง (อิเล็กทรอนิกส์)",
                "ปวช. สาขาเมคคาทรอนิกส์และหุ่นยนต์"
            ];

            let academicProgram = "";
            let academicProgramOther = "";

            if (standardPrograms.includes(dbPlan)) {
                academicProgram = dbPlan;
            } else if (dbPlan) {
                academicProgram = "อื่นๆ";
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
            } else if (laptopOS.startsWith("อื่นๆ:")) {
                laptopOSOther = laptopOS.replace("อื่นๆ: ", "");
                laptopOS = "อื่นๆ";
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
                info_address: safeDecode(info.std_info_address),

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
            if (studentInfo && studentInfo.std_info_first_name) {
                setAllData(prev => ({ ...prev, ...mapDbToForm(studentInfo) }));
            } else {
                const savedData = localStorage.getItem("comcamp37_reg_input");
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        if (parsed.email == user?.email) {
                            if (parsed.allData) setAllData(parsed.allData);
                            if (parsed.step) setStep(parsed.step);
                        }
                    } catch (e) { console.error(e); }
                }
            }
            setIsLoaded(true);
        };

        loadData();

    }, [studentInfo]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("comcamp37_reg_input", JSON.stringify({ step, allData, email: user?.email }));
        }
    }, [allData, step, isLoaded]);

    const next = () => setStep(s => s + 1);
    const prev = () => setStep(s => s - 1);

    if (!isLoaded) return <div className="p-10 text-center text-white">Loading...</div>;

    return (
        <RegisterCtx.Provider value={{ step, setStep, next, prev, allData, setAllData }}>
            {children}
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
    const { next, setAllData, allData } = useContext(RegisterCtx)
    const { user } = useUser();
    const { studentStatus } = useStudent();
    const router = useRouter()

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
        const { unsubscribe } = form.watch((values) => {
            setAllData((prev: any) => ({ ...prev, ...values }));
        });
        return unsubscribe;
    }, [form.watch, setAllData]);

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
                <div className="p-6 md:p-8 gap-6 flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <h2 className="text-xl font-bold text-white">ข้อมูลส่วนตัว</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* คำนำหน้า */}
                        <FormField
                            control={form.control}
                            name="name_prefix"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel>คำนำหน้าชื่อ</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                <SelectValue placeholder="เลือก" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem className="py-3 px-4" value="เด็กชาย">เด็กชาย</SelectItem>
                                            <SelectItem className="py-3 px-4" value="เด็กหญิง">เด็กชาย</SelectItem>
                                            <SelectItem className="py-3 px-4" value="นาย">นาย</SelectItem>
                                            <SelectItem className="py-3 px-4" value="นาง">นาง</SelectItem>
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
                                    <FormLabel>ชื่อจริง</FormLabel>
                                    <FormControl>
                                        <Input className="py-6 px-4 rounded-xl" placeholder="ชื่อจริง" {...field} />
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
                                    <FormLabel>นามสกุล</FormLabel>
                                    <FormControl>
                                        <Input className="py-6 px-4 rounded-xl" placeholder="นามสกุล" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสอง */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* ชื่อเล่น */}
                        <FormField
                            control={form.control}
                            name="name_nick"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel>ชื่อเล่น</FormLabel>
                                    <FormControl>
                                        <Input className="py-6 px-4 rounded-xl" placeholder="ชื่อเล่น" {...field} />
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
                                    <FormLabel>วันเดือนปีเกิด</FormLabel>
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
                                                        format(field.value, "d MMMM yyyy", { locale: th })
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
                                                    date > new Date() || date < new Date("2006-01-01")
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
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* เพศ */}
                        <FormField
                            control={form.control}
                            name="info_gender"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">

                                    <FormLabel>เพศกำเนิด</FormLabel>
                                    {/* ส่วนตัวเลือก Radio */}
                                    <FormControl>
                                        <RadioGroup
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
                                    <FormLabel>ศาสนา</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                            <SelectItem className="py-3 px-4" value="อื่นๆ">อื่นๆ</SelectItem>
                                            <SelectItem className="py-3 px-4" value="ไม่นับถือ">ไม่นับถือ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสี่ */ }
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* เบอร์โทรศัพท์ */}
                        <FormField
                            control={form.control}
                            name="info_phone"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-6">
                                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FontAwesomeIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" icon={faPhone} />
                                            <Input
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
                                    <FormLabel>อีเมล</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FontAwesomeIcon
                                                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                icon={faEnvelope}
                                            />
                                            {/* เปลี่ยนเป็น div แต่ใช้ Class เดิมที่คุณให้มาทั้งหมด */}
                                            <div
                                                className="border-input flex items-center min-w-0 border bg-muted/20 text-base shadow-xs transition-[color,box-shadow] md:text-sm py-3.5 px-4 pr-10 rounded-xl text-muted-foreground cursor-not-allowed"
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

                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="info_address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>ที่อยู่ปัจจุบัน</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="ที่อยู่"
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
                <div className="p-6 md:p-8 border-t border-twilight-indigo-800 bg-twilight-indigo-900/50 flex flex-col-reverse sm:flex-row-reverse justify-between gap-4">
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
    const {prev, next, setAllData, allData} = useContext(RegisterCtx);
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
        const { unsubscribe } = form.watch((values) => {
            setAllData((prev: any) => ({ ...prev, ...values }));
        });
        return unsubscribe;
    }, [form.watch, setAllData]);

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ระดับชั้นการศึกษา */}
                        <FormField
                            control={form.control}
                            name="academic_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ระดับชั้นการศึกษา <span className="opacity-40">(ปีการศึกษา 2568)</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <div className="flex flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="academic_program"
                                render={({ field }) => (
                                    <FormItem className={form.watch("academic_program") === "อื่นๆ" ? "w-auto" : "w-full"}>
                                        <FormLabel>แผนการเรียน</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="py-6 px-4 rounded-xl w-full">
                                                    <SelectValue placeholder="เลือก" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem className="py-3 px-4" value="วิทยาศาสตร์-คณิตศาสตร์">วิทยาศาสตร์-คณิตศาสตร์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="คณิตศาสตร์-คอมพิวเตอร์">คณิตศาสตร์-คอมพิวเตอร์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="วิทยาศาสตร์-คอมพิวเตอร์">วิทยาศาสตร์-คอมพิวเตอร์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="คณิตศาสตร์-ภาษาอังกฤษ (ศิลป์-คำนวณ)">คณิตศาสตร์-ภาษาอังกฤษ (ศิลป์-คำนวณ)</SelectItem>

                                                <SelectItem className="py-3 px-4" value="ปวช. สาขาคอมพิวเตอร์ธุรกิจ">ปวช. สาขาคอมพิวเตอร์ธุรกิจ</SelectItem>
                                                <SelectItem className="py-3 px-4" value="ปวช. สาขาช่างไฟฟ้ากำลัง (อิเล็กทรอนิกส์)">ปวช. สาขาช่างไฟฟ้ากำลัง (อิเล็กทรอนิกส์)</SelectItem>
                                                <SelectItem className="py-3 px-4" value="ปวช. สาขาเมคคาทรอนิกส์และหุ่นยนต์">ปวช. สาขาเมคคาทรอนิกส์และหุ่นยนต์</SelectItem>
                                                <SelectItem className="py-3 px-4" value="อื่นๆ">อื่นๆ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.watch("academic_program") === "อื่นๆ" && (
                                <FormField
                                    control={form.control}
                                    name="academic_program_other"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>โปรดระบุแผนการเรียน</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="py-6 px-4 rounded-xl border-blue-400 focus:ring-blue-500"
                                                    placeholder="เช่น ศิลป์-ภาษาญี่ปุ่น"
                                                    {...field}
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
                                    <FormLabel>ชื่อสถาบันการศึกษา</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                        <SchoolInput
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
                        <h2 className="col-span-1 text-lg font-bold text-white">ผลการเรียน</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
                        {/* GPAX */}
                        <FormField
                            control={form.control}
                            name="grade_gpax"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>ผลการเรียนเฉลี่ยสะสม (GPAX)</FormLabel>
                                    <FormControl>
                                        <Input
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

                                                if (parseFloat(formatted) > 4.00) {
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
                                    <FormLabel>คณิตศาสตร์</FormLabel>
                                    <FormControl>
                                        <Input
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

                                                if (parseFloat(formatted) > 4.00) {
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
                                    <FormLabel>วิทยาศาสตร์</FormLabel>
                                    <FormControl>
                                        <Input
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

                                                if (parseFloat(formatted) > 4.00) {
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
                                    <FormLabel>ภาษาอังกฤษ</FormLabel>
                                    <FormControl>
                                        <Input
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

                                                if (parseFloat(formatted) > 4.00) {
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
                                    <FormLabel>หมู่เลือด</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap gap-4"
                                        >
                                            {["A", "B", "O", "AB"].map((type) => (
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

                        {/* ข้อมูลทางการแพทย์อื่นๆ */}
                        {[
                            { id: "health_medicalRights", label: "สิทธิการรักษาพยาบาล", placeholder: "เช่น บัตรทอง" },
                            { id: "health_chronicDiseases", label: "โรคประจำตัว", placeholder: "ระบุโรคประจำตัวของคุณ (หากไม่มีให้กรอก \"-\")", area: true },
                            { id: "health_drugAllergies", label: "การแพ้ยา", placeholder: "ระบุชื่อยาที่แพ้ และอาการที่เกิดขึ้น เช่น ผื่นคัน, หายใจลำบาก (หากไม่มีให้กรอก \"-\")", area: true },
                            { id: "health_dietaryRestrictions", label: "ข้อจำกัดด้านอาหาร", placeholder: "เช่น แพ้อาหาร มังสวิรัติ ไม่ทานเผ็ด ประเภทอาหารที่สามารถทานได้ (หากไม่มีให้กรอก \"-\")", area: true },
                            { id: "health_more", label: "รายละเอียดเพิ่มเติม", placeholder: "ข้อมูลเพิ่มเติมเกี่ยวกับสุขภาพ และความปลอดภัย (ถ้ามี)", area: true, notreq: true }
                        ].map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name={item.id as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{item.label} {item.notreq ? (<span className="opacity-40">(ถ้ามี)</span>) : ''}</FormLabel>
                                        <FormControl>
                                            {item.area ? (
                                                <Textarea className="py-3 px-4 rounded-xl" placeholder={item.placeholder} rows={2} {...field}/>
                                            ) : (
                                                <Input className="py-6 px-4 rounded-xl" placeholder={item.placeholder} {...field}/>
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
    const {prev, next, setAllData, allData} = useContext(RegisterCtx);
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
        const { unsubscribe } = form.watch((values) => {
            setAllData((prev: any) => ({ ...prev, ...values }));
        });
        return unsubscribe;
    }, [form.watch, setAllData]);

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
                    education_plan: allData.academic_program === "อื่นๆ" ? allData.academic_program_other : allData.academic_program,
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
                    address: allData.info_address,
                    shirt_size: allData.apparel_size,
                    travel_plan: allData.availability_travelPlan,
                    laptop_os: allData.availability_laptop === "false"
                        ? "ไม่สะดวกนำมา"
                        : allData.availability_laptopOS === "Linux"
                            ? `Linux (${allData.availability_laptopOS_other})`
                            : allData.availability_laptopOS === "อื่นๆ"
                                ? `อื่นๆ: ${allData.availability_laptopOS_other}`
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ชื่อผู้ปกครอง */}
                        <FormField
                            control={form.control}
                            name="guardian_name"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel>ชื่อผู้ปกครอง</FormLabel>
                                    <FormControl>
                                        <Input className="py-6 px-4 rounded-xl" placeholder="" {...field} />
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
                                    <FormLabel>ความสัมพันธ์กับผู้ปกครอง</FormLabel>
                                    <FormControl>
                                        <Input className="py-6 px-4 rounded-xl" placeholder="เช่น บิดา มารดา" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    { /* แถวสอง */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* เบอร์โทรศัพท์ผู้ปกครอง */}
                        <FormField
                            control={form.control}
                            name="guardian_phone"
                            render={({ field }) => (
                                <FormItem className="col-span-1">
                                    <FormLabel>เบอร์ติดต่อผู้ปกครอง</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <FontAwesomeIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" icon={faPhone} />
                                            <Input
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
                        {/* เคยเข้า ComCamp ไหม */}
                        <FormField
                            control={form.control}
                            name="availability_haveAttended"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel>เคยเข้าร่วม ComCamp ไหม</FormLabel>
                                    <FormControl>
                                        <RadioGroup
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

                                    <FormLabel>สะดวกเข้าร่วมทุกวันไหม</FormLabel>
                                    <FormControl>
                                        <RadioGroup
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

                        { /* สะดวกนำ laptop มาไหม */}
                        <FormField
                            control={form.control}
                            name="availability_laptop"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel>สะดวกนำ Laptop มาไหม</FormLabel>
                                    <FormControl>
                                        <RadioGroup
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
                        { /* สะดวกนำ iPad/Tablet มาไหม */}
                        <FormField
                            control={form.control}
                            name="availability_tablet"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel>สะดวกนำ iPad/Tablet มาไหม</FormLabel>
                                    <FormControl>
                                        <RadioGroup
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
                        { /* สะดวกนำเมาส์มาไหม */}
                        <FormField
                            control={form.control}
                            name="availability_mouse"
                            render={({field}) => (
                                <FormItem className="col-span-1">

                                    <FormLabel>สะดวกนำเมาส์มาไหม</FormLabel>
                                    <FormControl>
                                        <RadioGroup
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
                        <div className="flex flex-row gap-5">
                            <FormField
                                control={form.control}
                                name="availability_laptopOS"
                                render={({ field }) => (
                                    <FormItem className={(form.watch("availability_laptop") === "true") && ((form.watch("availability_laptopOS") === "อื่นๆ" || form.watch("availability_laptopOS") === "Linux")) ? "w-auto" : "w-full"}>
                                        <FormLabel>ระบบปฏิบัติการ (OS)</FormLabel>
                                        <Select disabled={form.watch("availability_laptop") === "false"} onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <SelectItem className="py-3 px-4" value="อื่นๆ">อื่นๆ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {((form.watch("availability_laptop") === "true")&&(form.watch("availability_laptopOS") === "อื่นๆ" || form.watch("availability_laptopOS") === "Linux")) && (
                                <FormField
                                    control={form.control}
                                    name="availability_laptopOS_other"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{form.watch("availability_laptopOS") === "Linux" ? "Distro" : "โปรดระบุ"}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="py-6 px-4 rounded-xl border-blue-400 focus:ring-blue-500"
                                                    placeholder=""
                                                    {...field}
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
                                    <FormLabel>วิธีการเดินทางมาค่าย</FormLabel>
                                    <FormControl>
                                        <Textarea
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
                                    { size: "SS", chest: "34", length: "25" },
                                    { size: "S", chest: "36", length: "26" },
                                    { size: "M", chest: "38", length: "27" },
                                    { size: "L", chest: "40", length: "28" },
                                    { size: "XL", chest: "42", length: "29" },
                                    { size: "2XL", chest: "44", length: "30" },
                                    { size: "3XL", chest: "46", length: "31" },
                                    { size: "4XL", chest: "48", length: "32" },
                                    { size: "5XL", chest: "50", length: "33" }
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
                                    <FormLabel>เลือกขนาดเสื้อค่าย</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-5 gap-3"
                                        >
                                            {["SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map((type) => (
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
