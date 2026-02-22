"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFloppyDisk,
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
import {useEffect, useState} from "react";
import axios from "axios";
import { toast } from "sonner";

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
        if (studentRegisAnswer && studentRegisAnswer.length > 0) {

            const mappedValues = studentRegisAnswer.reduce((acc, item) => {

                const index = item.std_regis_answer_section.split('_')[1];
                const key = `question${index}`;

                acc[key] = item.std_regis_answer;
                return acc;
            }, {} as Record<string, string>);

            form.reset(mappedValues);
        }
    }, [studentRegisAnswer, form.reset]);

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
                            <div className="absolute right-0 hidden md:block px-4 py-2 bg-twilight-indigo-800/70 rounded-lg self-center text-sm text-white opacity-55">ห้ามใช้ AI ในการตอบคำถาม</div>
                        </div>
                        <div className="block md:hidden -my-3 px-4 py-2 bg-twilight-indigo-800/70 rounded-lg self-start text-xs text-white opacity-55">ห้ามใช้ AI ในการตอบคำถาม</div>
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