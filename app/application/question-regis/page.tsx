"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloud,
    faFloppyDisk, faHardDrive,
    faTents,
} from "@fortawesome/free-solid-svg-icons";

import { useStudent } from "@/contexts/StudentContext";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { questionRegisSchema } from "@/app/application/question-regis/schema";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from "sonner";
import {motion} from "motion/react";
import {format, formatDistanceToNow} from "date-fns";
import {th} from "date-fns/locale";

const prefixQuestion = "regis"
const postURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/question/regis/answer`

const questions = [
    { field: "question1", questionNum: 1, description: "", question: "น้องคาดหวังอะไรจากค่าย ComCamp 37", placeholder: "" },
    { field: "question2", questionNum: 2, description: "น้องได้เข้าร่วมการแข่งขันซึ่งต้องทำ Project เป็นทีม ทีมละ 5 คน โดยที่สมาชิกในทีมไม่เคยรู้จักกันมาก่อน ในกลุ่มมีสมาชิกคนหนึ่งที่มีความสามารถสูงกว่าเพื่อน ๆ เขาทำงานทุกอย่างแทนเพื่อนในกลุ่ม ส่งผลให้เพื่อนที่เหลือ รวมถึงตัวน้องรู้สึกว่าไม่ได้มีส่วนร่วมในการทำงาน", question: "ในฐานะที่น้องเป็นหนึ่งในสมาชิกกลุ่ม น้องจะมีวิธีการแก้ปัญหาอย่างไร จงอธิบาย", placeholder: "" },
    { field: "question3", questionNum: 3, description: "มดน้อยได้รับโอกาสเข้าไปเป็นมดฝึกงานในรังที่มดน้อยใฝ่ฝัน โดยราชินีมดมีอำนาจสูงสุด แต่เมื่อเริ่มงานมดน้อยกลับพบปัญหากับหัวหน้ามดงานซึ่งเป็นที่โปรดปรานของราชินี โดยหัวหน้ามดงานตัวนั้นมีพฤติกรรมเอารัดเอาเปรียบ รวมไปถึงการมอบหมายงานเกินกว่าขอบเขตที่ระบุไว้ในสัญญา นอกจากนี้ ยังได้ค่าจ้างซึ่งเป็นจำนวนน้ำตาลที่ไม่เหมาะสมกับขอบเขตของงานที่ทำ แม้มดน้อยจะรู้สึกว่าสิ่งนี้ไม่ยุติธรรมและไม่โปร่งใส แต่หัวหน้ามดงานดังกล่าวเป็นผู้ประเมินผลการฝึกงาน ซึ่งอาจส่งผลต่ออนาคตของมดน้อย", question: "หากน้องเป็นมดน้อยตัวนั้น น้องจะตัดสินใจและรับมือกับสถานการณ์นี้อย่างไร", placeholder: "" },
    {
        field: "question4",
        questionNum: 4,
        description: (
            <span className="text-pretty">
                ทีมพัฒนาเทคโนโลยีของบริษัทแห่งหนึ่งได้รับข้อเสนอให้พัฒนาระบบการจัดการโรงแรมโดยใช้ AI ซึ่งทีมจะต้องพัฒนาระบบ AI ที่มีความซับซ้อน มีขอบเขตงานขนาดใหญ่ และต้องใช้ทรัพยากรจำนวนมาก จึงทำให้ค่าใช้จ่ายของโครงการค่อนข้างสูง ในขณะเดียวกัน ลูกค้ายังไม่มีความรู้และความเข้าใจด้านระบบเทคโนโลยีมากนัก <strong>จึงมองว่าการพัฒนาระบบ AI ทำได้ง่ายและราคาไม่สูง</strong> ทำให้เริ่มไม่พอใจ จากสถานการณ์นี้ทำให้การเจรจาเริ่มตึงเครียดและมีความเสี่ยงที่โครงการจะไม่สามารถเดินหน้าต่อได้ ในฐานะที่น้องเป็นคนกลางที่ต้องประสานงานระหว่างทีมพัฒนาและลูกค้า
            </span>
        ),
        question: "น้องจะสื่อสารให้ลูกค้าที่ไม่มีความรู้เรื่องเทคโนโลยีน้อยสามารถเข้าใจสิ่งที่ทีมพัฒนาทำอย่างไร เพื่อให้โครงการนี้สามารถดำเนินการต่อไปได้",
        placeholder: ""
    },
    {
        field: "question5",
        questionNum: 5,
        description: (
            <span className="text-pretty">
                น้องจะต้องเดินทางเพื่อออกตามหากุญแจ 2 ดอก เพื่อนำไปเปิดกล่องสมบัติชิ้นสุดท้ายของตระกูลที่ถูกโจรสลัดขโมยไปเมื่อหลายสิบปีก่อน<br />
                <br />
                โดยน้องจะต้องเดินทางไปยัง 3 สถานที่ตามลำดับ     ดังนี้<br />
                <div className="ml-3">
                    1. ป่าดงดิบ<br />
                    2. ทะเลทราย<br />
                    3. ใต้มหาสมุทร
                </div>

                <br />

                <strong>รายละเอียดภารกิจ :</strong><br />
                <div className="ml-3">
                    • <strong>กุญแจดอกที่ 1:</strong> อยู่ที่กระท่อมของแม่มดในป่าดงดิบ ซึ่งมีการร่ายเวทพรางตาที่มองไม่เห็นด้วยตาเปล่า<br />
                    • <strong>กุญแจดอกที่ 2:</strong> อยู่ในโลงศพฟาโรห์ ชั้นใต้ดินของพีระมิดในทะเลทราย ซึ่งมีกับดักธนูอาบยาพิษรอทำงานอยู่<br />
                    • <strong>กล่องสมบัติ :</strong> อยู่ในซากเรืออัปปางใต้มหาสมุทรที่มีกระแสน้ำแปรปรวนอย่างรุนแรง<br /><br />
                </div>

                <strong>เงื่อนไขเพิ่มเติม:</strong><br />
                น้องต้องเลือกความสามารถของสัตว์ที่มีอยู่จริงและยังไม่สูญพันธุ์ทั้งหมด 2 ชนิด (เลือกได้กี่ความสามารถก็ได้จากสัตว์ชนิดนั้น)<br />
                <em className="opacity-75">เช่น "มดสามารถปล่อยฟีโรโมนและปล่อยพิษได้"</em>
            </span>
        ),
        question: "จงอธิบายเหตุผลในการเลือกสัตว์ ความสามารถ และวิธีการนำไปใช้แก้ปัญหาอย่างชัดเจน",
        placeholder: ""
    },
    { field: "question6", questionNum: 6, description: "", question: "ในปัจจุบันความรู้ด้านคอมพิวเตอร์สามารถเรียนรู้ได้ผ่านช่องทางออนไลน์ได้อย่างอิสระ อย่างไรก็ตาม น้องคิดว่าทำไมการเข้าศึกษาต่อในระดับอุดมศึกษา สาขาวิศวกรรมคอมพิวเตอร์จึงยังมีความสำคัญ", placeholder: "" }
]

export default function questionRegis() {
    const router = useRouter();
    const { applicationId, refreshApplication, studentRegisAnswer } = useStudent();
    const [loading, setLoading] = useState(false);

    const [dbData, setDbData] = useState<any>(null);
    const [isDataSelected, setIsDataSelected] = useState<boolean>(false);
    const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
    const [pendingLocalData, setPendingLocalData] = useState<any>(null);
    const [localDataTime, setLocalDataTime] = useState<any>(null);
    const [cloudDataTime, setCloudDataTime] = useState<any>(null);

    const form = useForm({
        resolver: zodResolver(questionRegisSchema),
        defaultValues: {
            question1: "",
            question2: "",
            question3: "",
            question4: "",
            question5: "",
            question6: "",
        },
    });

    useEffect(() => {
        let mappedValues: Record<string, string> = {};
        let latestDbTime = 0;
        let hasDbData = false;

        if (studentRegisAnswer && studentRegisAnswer.length > 0) {
            hasDbData = true;
            mappedValues = studentRegisAnswer.reduce((acc, item: any) => {
                const index = item.std_regis_answer_section.split('_')[1];
                acc[`question${index}`] = item.std_regis_answer;

                if (item.updated_at) {
                    const time = new Date(item.updated_at).getTime();
                    if (time > latestDbTime) latestDbTime = time;
                }
                return acc;
            }, {} as Record<string, string>);
            setDbData(mappedValues);
        }

        let localParsed: any = null;
        let localTime = 0;
        const savedData = localStorage.getItem("comcamp37_question_regis_draft");

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);

                if (parsed.application_id === applicationId) {
                    localParsed = parsed;
                    localTime = new Date(localParsed.updated_at).getTime();

                } else {
                    localStorage.removeItem("comcamp37_question_regis_draft");
                }
            } catch (e) { console.error(e); }
        }

        setCloudDataTime(latestDbTime);
        setLocalDataTime(localTime);

        if (localParsed && !hasDbData) {
            form.reset(localParsed.values);
        }
        else if (localParsed && hasDbData && localTime > latestDbTime) {
            setPendingLocalData(localParsed.values);
            setShowConflictModal(true);
            form.reset(mappedValues);
        }
        else if (hasDbData) {
            form.reset(mappedValues);
            if (localParsed) localStorage.removeItem("comcamp37_question_regis_draft");
        }
        setIsDataSelected(true);
    }, [studentRegisAnswer, form, applicationId]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const payload = {
            application_id: applicationId,
            answers: [
                { section: `${prefixQuestion}_1`, value: data.question1 },
                { section: `${prefixQuestion}_2`, value: data.question2 },
                { section: `${prefixQuestion}_3`, value: data.question3 },
                { section: `${prefixQuestion}_4`, value: data.question4 },
                { section: `${prefixQuestion}_5`, value: data.question5 },
                { section: `${prefixQuestion}_6`, value: data.question6 },
            ]
        };
        console.log("Submitting Answers:", payload);
        try {
            await axios.post(postURL,
                payload,
                { withCredentials: true }
            );

            localStorage.removeItem("comcamp37_question_regis_draft");

            await refreshApplication();

            toast.success("บันทึกคำตอบเรียบร้อยแล้ว");
            router.push("/application");
        } catch (error: any) {
            console.error(error);
            toast.error("บันทึกไม่สำเร็จ", {
                description: error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const { unsubscribe } = form.watch((values, { type }) => {
            if (type) {
                localStorage.setItem(
                    "comcamp37_question_regis_draft",
                    JSON.stringify({ values, application_id: applicationId, updated_at: new Date() })
                );
            }
        });
        return unsubscribe;
    }, [form.watch, applicationId]);

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

    const handleUseLocal = () => {
        if (pendingLocalData) form.reset(pendingLocalData);
        setShowConflictModal(false);
        setIsDataSelected(true);
    };

    const handleUseCloud = () => {
        if (dbData) form.reset(dbData);
        setShowConflictModal(false);
        localStorage.removeItem("comcamp37_question_regis_draft");
        setIsDataSelected(true);
    };

    if (showConflictModal) return (
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
    )

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-1 w-full max-w-[960px] mx-auto pt-6 md:px-6 md:pt-10"
            >

                <div className="bg-twilight-indigo-900 rounded-[40px] md:rounded-xl border border-twilight-indigo-800 shadow-sm overflow-hidden drop-shadow-xl drop-shadow-black/20">
                    <div className="p-6 md:p-8 gap-6 flex flex-col">
                        <div className="flex items-center flex-row relative gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                                <FontAwesomeIcon icon={faTents} />
                            </div>
                            <h2 className="text-xl font-bold text-white">ด่านตรวจเข้าเมือง</h2>
                            <div className="absolute right-0 hidden md:block px-4 py-2 bg-twilight-indigo-800/70 rounded-lg self-center text-sm text-white opacity-55">ห้ามใช้ AI ในการตอบคำถาม ให้ตอบตามความเข้าใจของน้อง</div>
                        </div>
                        <div className="block md:hidden -my-3 px-4 py-2 bg-twilight-indigo-800/70 rounded-lg self-start text-xs text-white opacity-55">ห้ามใช้ AI ในการตอบคำถาม ให้ตอบตามความเข้าใจของน้อง</div>
                        <div className="grid gap-10">
                            {questions.map((question) => (
                                <FormField
                                    key={question.field}
                                    control={form.control}
                                    name={question.field as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex flex-col items-start text-base">
                                                <div className="flex flex-row items-start gap-x-2">
                                                    <div>{question.questionNum}.</div><div className="leading-relaxed text-pretty">{question.description === "" ? question.question : question.description}</div>
                                                </div>
                                                <div className={`text-pretty ${question.question === "" || question.description === "" ? "hidden" : "block"}`}>{question.question}</div>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    data-clarity-mask="true"

                                                    placeholder={question.placeholder}
                                                    className="resize-none rounded-xl py-3 px-4 h-40"
                                                    rows={7}
                                                    {...field}
                                                    disabled={loading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 border-t border-twilight-indigo-800 bg-twilight-indigo-900/50 flex flex-col-reverse sm:flex-row justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="px-4 py-5 font-bold rounded-xl text-white hover:bg-twilight-indigo-700"
                            onClick={() => router.push('/application')}
                            disabled={loading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            className="px-8 py-5 font-bold rounded-xl bg-primary hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? (<>กำลังบันทึก <Spinner/></>) : (<>บันทึก <FontAwesomeIcon icon={faFloppyDisk}/></>)}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}