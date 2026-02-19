"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFloppyDisk, faPause, faPlay,
    faTents, faVolumeHigh, faVolumeMute,
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

import '@vidstack/react/player/styles/base.css';

import {MediaPlayer, MediaProvider, MuteButton, PlayButton, TimeSlider} from '@vidstack/react';

const prefixQuestion = "academic"
const postURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/question/academic/answer`

const questions = [
    { field: "question1", questionNum: 1, description: (
        <div className="w-full">
            <MediaPlayer className="rounded-2xl" aspectRatio="1/1" src="https://storage.comcamp.io/web-assets/cpe101-robot.mp4" autoplay={true} muted={true} loop={true}>
                <MediaProvider />

                {/* สร้าง Control Bar เอง */}
                <div className="absolute bottom-0 left-0 w-full px-4 py-2 flex flex-row items-center gap-4 bg-slate-900/50 ">

                    {/* ปุ่ม Play/Pause */}
                    <PlayButton className="group w-8 h-8 text-white hover:text-theme-secondary cursor-pointer">
                        {/* Vidstack จะจัดการ Logic การสลับ Icon ให้เองผ่าน CSS หรือคุณสามารถเขียน Logic เองได้ */}
                        {/* วิธีง่ายที่สุด: ใส่ทั้งคู่แล้วซ่อนด้วย CSS ของ Vidstack */}
                        <span className="hidden group-data-[paused]:block">
                            <FontAwesomeIcon icon={faPlay} />
                        </span>
                        <span className="group-data-[paused]:hidden">
                            <FontAwesomeIcon icon={faPause} />
                        </span>
                    </PlayButton>

                    <TimeSlider.Root className="group relative inline-flex w-full cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden">
                        <TimeSlider.Track className="relative ring-theme-secondary z-0 h-[5px] w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px]">
                            <TimeSlider.TrackFill className="bg-theme-secondary absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width]" />
                            <TimeSlider.Progress className="absolute z-10 h-full w-[var(--slider-progress)] rounded-sm bg-white/50 will-change-[width]" />
                        </TimeSlider.Track>
                        <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity group-data-[active]:opacity-100 group-data-[dragging]:ring-4 will-change-[left]" />
                    </TimeSlider.Root>

                </div>
            </MediaPlayer>
        </div>
        ), question: "Academic_Test1", placeholder: "" },
    { field: "question2", questionNum: 2, description: "", question: "Academic_Test2", placeholder: "" },
]

export default function questionAcademic() {
    const router = useRouter();
    const { applicationId, refreshApplication, studentAcademicAnswer } = useStudent();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(questionAcademicSchema),
        defaultValues: {
            question1: "",
            question2: "",
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
                { section: `${prefixQuestion}_2`, value: data.question2 }
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
                className="flex-1 w-full max-w-[960px] mx-auto py-6 md:px-6 md:py-10"
            >

                <div className="bg-slate-900 rounded-[40px] md:rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 gap-6 flex flex-col">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-slate-800 text-white">
                                <FontAwesomeIcon icon={faTents} />
                            </div>
                            <h2 className="text-xl font-bold text-white">ด่านตรวจเข้าเมือง</h2>
                        </div>
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

                    <div className="p-6 md:p-8 border-t border-slate-800 bg-slate-900/50 flex flex-col-reverse sm:flex-row justify-between gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="px-4 py-5 font-bold rounded-xl text-white hover:bg-slate-700"
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