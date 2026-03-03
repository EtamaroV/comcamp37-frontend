"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFloppyDisk, faPersonHiking,
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
import { questionAcademicSchema } from "@/app/application/question-academic/schema";
import {useEffect, useState} from "react";
import axios from "axios";
import { toast } from "sonner";

const prefixQuestion = "academic"
const postURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/question/academic/answer`

const questions = [
    
    { field: "question1",  questionNum: 1,  description: (
        <div>
            <span className="text-pretty">
                1. ให้น้องอธิบายลำดับขั้นตอนการทำงานของโปรแกรมที่ใช้หา จำนวนเฉพาะ (จำนวนเต็มบวกที่มากกว่า 1 และมีตัวหารที่เป็นบวกอยู่ 2 ตัว คือ 1 กับตัวมันเอง) ทั้งหมดตั้งแต่ A ถึง B (รวม A และ B ด้วย) โดย B จะมากกว่า A เสมอ โดยต้องแสดงเลขที่เจอทั้งหมดเรียงจากน้อยไปหามาก หากไม่เจอเลยให้ตอบว่า <span className="font-extrabold">NONE</span> และบรรทัดสุดท้ายต้องแสดง ผลรวม ของเลขเหล่านั้นด้วย เช่น เมื่อ
                <div className="ml-3 [&>span]:font-extrabold my-3">
                    1) A เป็น 1 และ B เป็น 10 คำตอบบรรทัดแรกจะเป็น 2 3 5 7 และคำตอบบรรทัดที่สองจะเป็น 17<br />
                    2) A เป็น 8 และ B เป็น 10 คำตอบบรรทัดแรกจะเป็น <span>NONE</span> และคำตอบบรรทัดที่สองจะเป็น 0<br />

                </div>
            </span>
        </div>
    ), question: "",  placeholder: "" },
    { field: "question201",  questionNum: 2,  description: (
        <div>
             <span className="text-pretty">
               2. จงตอบคำถามต่อไปนี้หากน้องต้องการเขียนโปรแกรมเพื่อเก็บข้อมูลนักเรียน 1 คน ซึ่งประกอบด้วยข้อมูลดังนี้ <br />
                <div className="ml-3 my-3">
                    1. ชื่อนักเรียน เช่น "Somchai" <br />
                    2. อายุ เช่น 15 <br />
                    3. สถานะโรคประจำตัว คือมีและไม่มี <br />
                    4. น้ำหนัก เช่น 48.5<br />
                </div>
            </span>
        </div>
    ), question: "2.1. ข้อมูลแต่ละประเภทควรใช้ชนิดข้อมูลอะไรในภาษา C เพราะเหตุใด จงอธิบาย",  placeholder: "" },
    { field: "question202",  questionNum: 3,  description: "", question: "2.2. หากน้ำหนักมีทศนิยมที่ละเอียดมากควรปรับเปลี่ยนชนิดของข้อมูลหรือไม่ อย่างไร",  placeholder: "" },
    { field: "question203",  questionNum: 3,  description: "", question: "2.3. จงยกตัวอย่างสิ่งที่อาจจะเกิดขึ้นได้หากใช้ชนิดข้อมูลผิดรูปแบบมาอย่างน้อยหนึ่งข้อ",  placeholder: "" },
    { field: "question3",  questionNum: 3,  description: "", question: "3. ในภาษา C เมื่อเราต้องการเก็บข้อมูลชนิดเดียวกันหลาย ๆ ตัว เราจะใช้โครงสร้างข้อมูลชนิดหนึ่งซึ่งเราต้องระบุขนาดของมันไว้ตั้งแต่ตอนประกาศตัวแปร หากน้อง ๆ ระบุขนาดของโครงสร้างข้อมูลชนิดนี้ไว้ 5 แต่พยายามใส่ข้อมูลตำแหน่งที่ 6 ลงไปจะเกิดอะไรขึ้น เพราะเหตุใด จงอธิบายโดยละเอียด",  placeholder: "" },
    { field: "question4",  questionNum: 4,  description: "", question: "4. ในความคิดของน้อง ทำไมเราถึงต้องเรียนภาษา C แม้ว่าจะมีภาษาอื่น ๆ บนโลกอีกมากมาย",  placeholder: "" },
    { field: "question5",  questionNum: 5,  description: (
        <span className="text-pretty">
                <div>
                5. น้องคิดว่า “Microcontroller” คืออะไร และเคยมีประสบการณ์อะไรเกี่ยวกับ Microcontroller มาบ้าง <br />
                <strong> หมายเหตุ ถ้าน้องไม่รู้จักหรือไม่เคยมีประสบการณ์ให้ตอบตามความเป็นจริงได้เลย</strong>
                </div>
            </span>
    ), question: "",  placeholder: "" },
    { field: "question6",  questionNum: 6,  description: "", question: "6. ในการทำงานร่วมชิ้นงานที่มีความจำเป็นต้องใช้ micro:bit หากเราได้ทำการตรวจสอบแล้วว่าโค้ดที่ได้ทำการเขียนขึ้นมาถูกต้องสมบูรณ์แล้ว แต่เมื่อทำนำ Micro:bit เชื่อมต่อสายไฟเข้ากับมอเตอร์จริง ๆ มอเตอร์กลับไม่ทำงาน จากสถานการณ์เบื้องต้นน้องคิดว่าปัญหาน่าจะเกิดจากอะไรได้บ้าง?",  placeholder: "" },
    { field: "question7",  questionNum: 7,  description: (
        <div>
             <span className="text-pretty">
                7. น้องจะต้องบังคับหุ่นยนต์ให้เก็บซากหุ่นต่าง ๆ ในพื้นที่ ไปไว้ที่จุด Checkpoint 2 จุดที่แตกต่างกันสำหรับหุ่นยนต์แต่ละประเภท ถ้าหากวางในที่ที่ผิดประเภท จะโดนหักคะแนน โดยจะเก็บครั้งละกี่ตัวก็ได้ และจะต้องเก็บให้ได้มากที่สุดภายในระยะเวลาที่จำกัด (ขยะชิ้นใหญ่และขยะชิ้นเล็กจะได้คะแนนแตกต่างกัน ขยะชิ้นใหญ่จะได้คะแนนมากกว่าชิ้นเล็ก แต่ถ้าวางชิ้นใหญ่ผิดประเภทก็จะลบคะแนนมากกว่าเช่นกัน) <br />
                <br /><strong className="font-lg/4">พี่ ๆ มีหุ่นยนต์มาให้น้องเลือก 2 ตัว ในการเอาไปทำภารกิจ เก็บซากหุ่นยนต์ โดยให้น้องเลือกหุ่นยนต์ตัวใดตัวหนึ่ง และอธิบายว่าทำไมน้องถึงเลือกหุ่นยนต์ตัวนั้น รวมถึงวิธีการที่น้องจะทำภารกิจนี้ให้สำเร็จ</strong><br />
                {/* ยังไม่ได้เพอ่มรูปน้า */}
                
                <div className='flex flex-col md:flex-row [&>div]:mx-5 my-3 flex-1 gap-5'>

                    <div className='flex flex-col flex-1'>

                        <strong className="text-lg">หุ่นยนต์ A</strong>
                        <p className="text-sm flex-1 mt-1"> 
                            Code name: สาส์นจากสวรรค์หุ่นยนต์ผู้ซึ่งปลดแอกจากการจองจำของปีศาจจากขุมนรก
                        </p>

                        <img 
                            src="https://storage.comcamp.io/web-assets/exam/robotA.png" 
                            className='w-full aspect-square object-cover rounded-md mt-2' 
                            alt="Robot A"
                        />

                    </div>


                    <div className='flex flex-col flex-1'>
                        <strong className="text-lg">หุ่นยนต์ B</strong>
                        <p className="text-sm flex-1 mt-1">
                            Code name: ราชาปีศาจหุ่นยนต์ผู้ซึ่งทำลายล้างทุกสิ่งผู้ที่ปกครองทุกอย่างผู้ที่เกิดมาเพื่อสร้างความโกลาหลแก่โลกใบนี้
                        </p>
                        <img 
                            src="https://storage.comcamp.io/web-assets/exam/robotB.png" 
                            className='w-full aspect-square object-cover rounded-md mt-2' 
                            alt="Robot B"
                        />
                    </div>
                </div>
                
            </span>
        </div>
    ), question: "คำตอบ",  placeholder: "" },
    { field: "question8",  questionNum: 8,  description: "", question: "8. ในความคิดของน้อง AI คืออะไร เเละ AI ถูกสร้างขึ้นมาเพื่ออะไร",  placeholder: "" },
    { field: "question9",  questionNum: 9,  description: "", question: "9. สมมุติว่าน้องได้ทำการสร้าง AI ผ่านกระบวนการ Machine learning ขึ้นมาตัวหนึ่งเพื่อช่วยในการเเยกขยะ ก่อนนำไปรีไซเคิลแต่ในขั้นตอนการทดสอบกลับพบว่า AI ตรวจจับขวดน้ำที่ทำจากเเก้วว่าเป็นขวดที่ทำจาก พลาสติก เมื่อทำการตรวจสอบปัญหาพบว่าส่วนของ Hardware (เช่น กล้อง) ไม่มีส่วนเกี่ยวข้องกับปัญหาในครั้งนี้ น้องคิดว่าที่มาของปัญหาในครั้งนี้คืออะไร เเละน้องจะมีเเนวทางเเก้ปัญหาอย่างไรเพื่อให้ AI สามารถตรวจสอบเเละเเยกขวดเเก้วออกจากขวดพลาสติกได้",  placeholder: "" },
    { field: "question10", questionNum: 10, description: "", question: "10. ในความคิดของน้อง น้องคิดว่าการเรียนรู้ของ AI นั้นเหมือนกับมนุษย์หรือไม่ อย่างไร", placeholder: "" }


]

export default function questionAcademic() {
    const router = useRouter();
    const { applicationId, refreshApplication, studentAcademicAnswer } = useStudent();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(questionAcademicSchema),
        defaultValues: {
            question1: "",
            question201: "",
            question202: "",
            question203: "",
            question3: "",
            question4: "",
            question5: "",
            question6: "",
            question7: "",
            question8: "",
            question9: "",
            question10: "",
        },
    });

    useEffect(() => {
        if (studentAcademicAnswer && studentAcademicAnswer.length > 0) {

            const mappedValues = studentAcademicAnswer.reduce((acc, item) => {

                const index = item.std_academic_answer_section.split('_')[1];
                const key = `question${index}`;

                acc[key] = item.std_academic_answer;
                return acc;
            }, {} as Record<string, string>);

            form.reset(mappedValues);
        }
    }, [studentAcademicAnswer, form.reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const payload = {
            application_id: applicationId,
            answers: [
                { section: `${prefixQuestion}_1`, value: data.question1 },
                { section: `${prefixQuestion}_201`, value: data.question201 },
                { section: `${prefixQuestion}_202`, value: data.question202 },
                { section: `${prefixQuestion}_203`, value: data.question203 },
                { section: `${prefixQuestion}_3`, value: data.question3 },
                { section: `${prefixQuestion}_4`, value: data.question4 },
                { section: `${prefixQuestion}_5`, value: data.question5 },
                { section: `${prefixQuestion}_6`, value: data.question6 },
                { section: `${prefixQuestion}_7`, value: data.question7 },
                { section: `${prefixQuestion}_8`, value: data.question8 },
                { section: `${prefixQuestion}_9`, value: data.question9 },
                { section: `${prefixQuestion}_10`, value: data.question10 }
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
                        <div className="flex flex-row items-center gap-3 relative">
                            <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                                <FontAwesomeIcon icon={faPersonHiking} />
                            </div>
                            <h2 className="text-xl font-bold text-white">บททดสอบแห่งพงไพร</h2>
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
                                                    <div className="leading-relaxed text-pretty">{question.description === "" ? question.question : question.description}</div>
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