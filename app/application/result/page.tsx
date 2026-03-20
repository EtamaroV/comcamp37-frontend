"use client"
import React, {useState, useEffect, useCallback, useRef} from "react";

import Mug from "@/components/result/Mug";
import ConfirmationCard from "@/components/result/ConfirmationCard";
import Image from "next/image";
import {useStudent} from "@/contexts/StudentContext";
import Stamp from "@/components/result/Stamp";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {Variants} from "motion";
import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true";

import { z } from "zod";
import {toast} from "sonner";
import FileUpload from "@/app/application/result/FileUpload";
import {faDownload, faReceipt, faShareFromSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faSquareFacebook, faTiktok} from "@fortawesome/free-brands-svg-icons";

import {TimerStatus, useCountdown} from "@/app/application/countdown";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);
    return matches;
};

const declineSchema = z.string()
    .min(1, "กรุณาระบุเหตุผลการสละสิทธิ์")

const resultState = {
    fail: {
        confirm: false,
        timer: false,

        title: 'ขอแสดงความเสียใจ',
        bigtext: (<span className="text-red-700">คุณไม่ผ่านการ<br className="sm:hidden"/>คัดเลือก</span>),
        more: 'ทีมงานอยากบอกว่า อย่าเพิ่งเสียใจไปนะครับ! พวกเราเห็นถึงความตั้งใจของน้องๆ จากใบสมัคร และหวังเป็นอย่างยิ่งว่าเราจะได้พบกันใหม่ในกิจกรรมครั้งต่อๆ ไปของ ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี ครับ',

        stamp: 'fail',
        image: 'https://storage.comcamp.io/web-assets/result/fail.webp'
    },
    pass: {
        confirm: true,
        timer: false,

        title: 'ขอแสดงความยินดี',
        bigtext: (<span className="text-[#1CAA00]">คุณผ่านการ<br className="sm:hidden"/>คัดเลือก</span>),
        more: (<span>ขอให้น้องๆ รอติดตามประกาศการเรียกตัวสำรอง ในวันที่ 23 กุมภาพันธ์ 2569 ทางโทรศัพท์ได้เลยนะครับ</span>),

        stamp: 'pass',
        image: 'https://storage.comcamp.io/web-assets/result/pass.webp'
    },
    reserve: {
        confirm: false,
        timer: true,

        title: 'ข่าวดี !',
        bigtext: (<span className="text-yellow-600">คุณมีสิทธิ<br className="sm:hidden"/>ตัวสำรอง</span>),
        more: (<>ขอขอบคุณที่ให้ความสนใจในโครงการ น้องมีสิทธิเป็นตัวสำรอง<br className="md:block hidden"/>หากได้รับเลือกเป็นตัวจริงจะมีการติดต่อยืนยันจากพี่ค่าย<br className="md:block hidden"/>พี่ค่ายจะทำการติดต่อน้อง<span className="font-semibold">ภายในวันที่ 23 มีนาคม 2568</span> <br className="md:block hidden"/>โปรดเตรียมรับโทรศัพท์ตามหมายเลขที่กรอกเอาไว้ในใบสมัคร</>),

        stamp: 'reserve',
        image: 'https://storage.comcamp.io/web-assets/result/reserve.webp'
    },
    waiting_for_announcement: {
        confirm: false,
        timer: true,

        title: 'ยังไม่ประกาศ',
        bigtext: 'ยังไม่ประกาศ',
        more: '',

        stamp: '',
        image: 'https://storage.comcamp.io/web-assets/result/reserve.webp'
    }
};

type ResultStatus = keyof typeof resultState;

const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const LoadingdotVariants:Variants = {
    initial: { y: 0 },
    animate: {
        y: -10,
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeOut"
        }
    }
};

const LoadingcontainerVariants:Variants = {
    initial: { opacity: 1 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    },
    exit: { opacity: 0 }
};

interface CountdownLabelProps {
    status: TimerStatus;
}

const CountdownLabel: React.FC<CountdownLabelProps> = ({ status }) => {
    return (
        <div className=" absolute z-20 text-black pb-4 flex flex-row items-center gap-x-0 sm:gap-x-6 sm:scale-100 scale-140">
            <div className="scale-75 sm:block hidden">
                <svg width="86" height="90" viewBox="0 0 86 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_1165_319" maskUnits="userSpaceOnUse" x="-1" y="0" width="87" height="90">
                    <path d="M85.8173 27.9033L53.3767 0L-0.000488281 62.0567L32.4401 89.96L85.8173 27.9033Z" fill="white"/>
                </mask>
                <g mask="url(#mask0_1165_319)">
                    <path d="M58.9791 26.8541C55.5584 23.3763 51.4869 26.4098 48.9975 26.597C46.4946 26.7852 43.5871 25.481 41.9702 26.1739C36.4678 28.531 31.2026 39.906 27.2728 45.078C22.5374 51.3082 5.35425 65.453 12.2084 72.518C19.283 79.8081 34.7335 64.5329 40.2447 59.0473C45.3049 54.0107 56.8921 49.879 59.4041 44.3974C60.1306 42.811 59.1036 39.5929 58.9413 37.4345C58.7142 34.4296 62.4412 30.3738 58.9791 26.8541Z" fill="#0D0C0C"/>
                    <mask id="mask1_1165_319" maskUnits="userSpaceOnUse" x="59" y="29" width="20" height="20">
                        <path d="M78.1354 36.8359L69.7099 29.5889L59.8307 41.0746L68.2562 48.3216L78.1354 36.8359Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask1_1165_319)">
                        <path d="M76.0355 35.3058C74.3345 32.2925 68.7774 32.7699 65.2783 35.3397C63.75 36.4624 60.9924 38.4984 62.1389 42.244C63.2257 45.7938 67.4863 45.1406 69.2395 44.5105C73.344 43.0367 77.926 38.6558 76.0355 35.3058Z" fill="#0D0C0C"/>
                    </g>
                    <mask id="mask2_1165_319" maskUnits="userSpaceOnUse" x="36" y="7" width="20" height="19">
                        <path d="M48.2413 7.24896L36.8591 17.248L44.194 25.5976L55.5763 15.5986L48.2413 7.24896Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask2_1165_319)">
                        <path d="M49.7837 9.32695C52.8142 10.9964 52.3968 16.5578 49.8625 20.083C48.7558 21.6227 46.7491 24.4008 42.9916 23.2943C39.4296 22.2452 40.0399 17.9773 40.6509 16.2162C42.0824 12.1002 46.4152 7.47146 49.7837 9.32695Z" fill="#0D0C0C"/>
                    </g>
                    <mask id="mask3_1165_319" maskUnits="userSpaceOnUse" x="59" y="15" width="19" height="19">
                        <path d="M77.6891 21.5406L70.2292 15.124L59.7842 27.2674L67.2441 33.684L77.6891 21.5406Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask3_1165_319)">
                        <path d="M64.3029 22.073C62.9653 23.3995 60.3314 26.6611 62.3946 29.3604C64.8656 32.5925 68.8728 30.8426 70.4571 29.5966C72.6657 27.8582 77.425 22.0502 75.09 19.3556C72.3842 16.2311 66.2791 20.1159 64.3029 22.073Z" fill="#0D0C0C"/>
                    </g>
                    <mask id="mask4_1165_319" maskUnits="userSpaceOnUse" x="50" y="7" width="20" height="19">
                        <path d="M62.121 7.17435L50.8535 18.5596L57.8476 25.4814L69.1152 14.0962L62.121 7.17435Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask4_1165_319)">
                        <path d="M62.6534 20.5511C61.4402 21.9908 58.399 24.8771 55.5435 23.0381C52.123 20.8345 53.5453 16.7002 54.6617 15.0203C56.2166 12.6799 61.6248 7.4698 64.4974 9.58075C67.8294 12.0283 64.446 18.4257 62.6534 20.5511Z" fill="#0D0C0C"/>
                    </g>
                </g>
            </svg>
            </div>
            <div className="sm:block flex flex-col justify-center items-center">
                <div className="text-sm">COMCAMP FILE RELEASE IN:</div>
                <div className="font-medium text-6xl pt-2 leading-13">
                    {String(status.days).padStart(2, '0')}:<br className="sm:hidden"/>
                    {String(status.hours).padStart(2, '0')}:<br className="sm:hidden"/>
                    {String(status.minutes).padStart(2, '0')}:<br className="sm:hidden"/>
                    <span className="text-red-500">{String(status.seconds).padStart(2, '0')}</span>
                </div>
            </div>
            <div className="scale-75 sm:static absolute sm:right-auto -right-10">
                <svg width="86" height="90" viewBox="0 0 86 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_1165_319" maskUnits="userSpaceOnUse" x="-1" y="0" width="87" height="90">
                        <path d="M85.8173 27.9033L53.3767 0L-0.000488281 62.0567L32.4401 89.96L85.8173 27.9033Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask0_1165_319)">
                        <path d="M58.9791 26.8541C55.5584 23.3763 51.4869 26.4098 48.9975 26.597C46.4946 26.7852 43.5871 25.481 41.9702 26.1739C36.4678 28.531 31.2026 39.906 27.2728 45.078C22.5374 51.3082 5.35425 65.453 12.2084 72.518C19.283 79.8081 34.7335 64.5329 40.2447 59.0473C45.3049 54.0107 56.8921 49.879 59.4041 44.3974C60.1306 42.811 59.1036 39.5929 58.9413 37.4345C58.7142 34.4296 62.4412 30.3738 58.9791 26.8541Z" fill="#0D0C0C"/>
                        <mask id="mask1_1165_319" maskUnits="userSpaceOnUse" x="59" y="29" width="20" height="20">
                            <path d="M78.1354 36.8359L69.7099 29.5889L59.8307 41.0746L68.2562 48.3216L78.1354 36.8359Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask1_1165_319)">
                            <path d="M76.0355 35.3058C74.3345 32.2925 68.7774 32.7699 65.2783 35.3397C63.75 36.4624 60.9924 38.4984 62.1389 42.244C63.2257 45.7938 67.4863 45.1406 69.2395 44.5105C73.344 43.0367 77.926 38.6558 76.0355 35.3058Z" fill="#0D0C0C"/>
                        </g>
                        <mask id="mask2_1165_319" maskUnits="userSpaceOnUse" x="36" y="7" width="20" height="19">
                            <path d="M48.2413 7.24896L36.8591 17.248L44.194 25.5976L55.5763 15.5986L48.2413 7.24896Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask2_1165_319)">
                            <path d="M49.7837 9.32695C52.8142 10.9964 52.3968 16.5578 49.8625 20.083C48.7558 21.6227 46.7491 24.4008 42.9916 23.2943C39.4296 22.2452 40.0399 17.9773 40.6509 16.2162C42.0824 12.1002 46.4152 7.47146 49.7837 9.32695Z" fill="#0D0C0C"/>
                        </g>
                        <mask id="mask3_1165_319" maskUnits="userSpaceOnUse" x="59" y="15" width="19" height="19">
                            <path d="M77.6891 21.5406L70.2292 15.124L59.7842 27.2674L67.2441 33.684L77.6891 21.5406Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask3_1165_319)">
                            <path d="M64.3029 22.073C62.9653 23.3995 60.3314 26.6611 62.3946 29.3604C64.8656 32.5925 68.8728 30.8426 70.4571 29.5966C72.6657 27.8582 77.425 22.0502 75.09 19.3556C72.3842 16.2311 66.2791 20.1159 64.3029 22.073Z" fill="#0D0C0C"/>
                        </g>
                        <mask id="mask4_1165_319" maskUnits="userSpaceOnUse" x="50" y="7" width="20" height="19">
                            <path d="M62.121 7.17435L50.8535 18.5596L57.8476 25.4814L69.1152 14.0962L62.121 7.17435Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask4_1165_319)">
                            <path d="M62.6534 20.5511C61.4402 21.9908 58.399 24.8771 55.5435 23.0381C52.123 20.8345 53.5453 16.7002 54.6617 15.0203C56.2166 12.6799 61.6248 7.4698 64.4974 9.58075C67.8294 12.0283 64.446 18.4257 62.6534 20.5511Z" fill="#0D0C0C"/>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default function resultPage() {
    const { applicationId, studentInfo, ApplicationStatus, refreshApplication } = useStudent();

    const [statusResult, setStatus] = useState<ResultStatus>("waiting_for_announcement");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isOpenDeclineModal, setOpenDeclineModal] = useState<boolean>(false);
    const [DeclineReason, setDeclineReason] = useState("");
    const [errorDeclineReason, setErrorDeclineReason] = useState<string | null>(null);
    const [sendingTimer, setSendingTimer] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isSendingDeclineReason, setIsSendingDeclineReason] = useState<boolean>(false);


    const statusShowResult = useCountdown(process.env.NEXT_PUBLIC_TIME_SHOW_RESULT || "2026-03-21T00:00:00+07:00");

    const isMobile = useMediaQuery("(max-width: 767px)");

    const fetchData = useCallback(async () => {

        if (isMockMode) {
            setStatus("pass");
            setIsLoading(false)
            return;
        }

        if (!applicationId) return;

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/application/${applicationId}/result`, { withCredentials: true });
            if (response.data.std_application_result) {
                setStatus(response.data.std_application_result);
                setIsLoading(false)
            }
        } catch (error:any) {
            setTimeout(() => {
                fetchData();
            }, 5000);
        } finally {

        }
    }, [ApplicationStatus]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!statusShowResult.isExpired) return;

        const checkStatus = () => {
            if (statusResult === 'waiting_for_announcement') {
                console.log("Status still waiting... retrying refresh.");
                fetchData();
            }
        };

        checkStatus();

        const retryInterval = setInterval(() => {
            if (statusResult !== 'waiting_for_announcement') {
                clearInterval(retryInterval);
            } else {
                checkStatus();
            }
        }, 10000);

        return () => clearInterval(retryInterval);

    }, [statusShowResult.isExpired]);

    const handleDecline = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const result = declineSchema.safeParse(DeclineReason);
        if (!result.success) {
            setErrorDeclineReason(result.error.issues[0].message);
            return;
        }

        setErrorDeclineReason(null);
        setSendingTimer(5);

        if (timerRef.current) clearInterval(timerRef.current);

        const countdown = setInterval(() => {
            setSendingTimer((prev) => {
                if (prev === null) {
                    clearInterval(countdown);
                    return null;
                }

                if (prev <= 1) {
                    clearInterval(countdown);

                    if (!isSendingDeclineReason) {
                        handleConfirmSubmit(result.data);
                    }

                    return null;
                }

                return prev - 1;
            });
        }, 1000);

        timerRef.current = countdown;
    };

    const isSubmittingRef = useRef(false);
    const handleConfirmSubmit = async (reason: string) => {
        if (isSendingDeclineReason) return;
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSendingDeclineReason(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/confirmation`,
                {
                    application_id: applicationId,
                    confirm: false,
                    reason: reason
                },
                { withCredentials: true }
            );
            setOpenDeclineModal(false);
            setDeclineReason("")
            toast.success("สละสิทธิ์เรียบร้อยแล้ว");
        } catch (error:any) {
            toast.error("ส่งไม่สำเร็จ", {
                description: error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
            });
        } finally {
            setIsSendingDeclineReason(false);
        }
    };

    const handleCancelSending = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setSendingTimer(null);
        }
    };

    const [isOpenComfirmationModal, setOpenComfirmationModal] = useState<boolean>(false);

    // IG Story
    const [storyLoading, setStoryLoading] = useState(true)
    const [canShare, setCanShare] = useState(false);
    const [storyError, setStoryError] = useState('');

    const [storyData, setStoryData] = useState<{
        blob: Blob;
        objectUrl: string;
        contentType: string;
        fileName: string;
    } | null>(null);

    useEffect(() => {
        let currentObjectUrl = '';

        const fetchImageOnce = async () => {
            setStoryLoading(true);
            setStoryData(null);

            try {
                const response = await fetch(`/api/ig-story-confirmation?name=${studentInfo?.std_info_nick_name}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();

                currentObjectUrl = window.URL.createObjectURL(blob);

                const contentType = response.headers.get('content-type') || 'image/png';
                const extension = contentType.split('/')[1] || 'png';
                const fileName = `ComCamp_37-น้อง${decodeURIComponent(studentInfo?.std_info_nick_name || "")}.${extension}`;

                setStoryData({
                    blob,
                    objectUrl: currentObjectUrl,
                    contentType,
                    fileName,
                });

                if (navigator.canShare) {
                    const testFile = new File([blob], fileName, { type: contentType });
                    setCanShare(navigator.canShare({ files: [testFile] }));
                } else {
                    setCanShare(false);
                }

            } catch (err) {
                console.error('Error pre-fetching image:', err);
                setStoryError('ไม่สามารถโหลดรูปภาพพรีวิวได้');
            } finally {
                setStoryLoading(false);
            }
        };

        if (ApplicationStatus?.std_application_confirm) {
            fetchImageOnce();
        }

        return () => {
            if (currentObjectUrl) {
                window.URL.revokeObjectURL(currentObjectUrl);
            }
        };
    }, [ApplicationStatus, studentInfo?.std_info_nick_name]);

    // download
    const handleDownload = () => {
        if (!storyData) return;
        const link = document.createElement('a');
        link.href = storyData.objectUrl;
        link.download = storyData.fileName;
        link.click();
    };

    // share
    const handleShare = async () => {
        if (!storyData) return;
        const file = new File([storyData.blob], storyData.fileName, { type: storyData.contentType });
        try {
            await navigator.share({ files: [file], title: 'Share to Story' });
        } catch (err) {
            console.log('Share cancelled or failed', err);
        }
    };

    const current = resultState[statusResult];

    return (
        <>
            <AnimatePresence>
                {isOpenDeclineModal && (
                    <div className="fixed inset-0 z-1001 flex items-center justify-center p-4">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (sendingTimer !== null) return;
                                setOpenDeclineModal(false)
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-twilight-indigo-900 border border-twilight-indigo-700 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-4 md:gap-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">ยืนยันการสละสิทธิ์</h2>
                                <p className="text-red-500">
                                    หากกดยืนยันการสละสิทธิ์แล้ว จะไม่สามารถกลับมาแก้ไขได้อีก กรุณาตัดสินใจให้แน่ใจก่อนกดยืนยัน
                                </p>
                            </div>

                            <FieldSet>
                                <FieldGroup>
                                    <Field className="">
                                        <FieldLabel htmlFor="Reason">
                                            <div className="relative">
                                                <span className="absolute text-red-500 text-xs -left-[8px]">*</span>
                                                เหตุผลการสละสิทธิ์
                                            </div>
                                        </FieldLabel>
                                        <Textarea
                                            id="Reason"
                                            value={DeclineReason}
                                            onChange={(e) => {
                                                setDeclineReason(e.target.value);
                                                if (errorDeclineReason) setErrorDeclineReason(null);
                                            }}
                                            disabled={isSendingDeclineReason}
                                            required
                                            placeholder="เช่น ติดธุระไม่สามารถเข้าร่วมได้"
                                            className="resize-none max-h-25 !bg-twilight-indigo-700"
                                            rows={5}
                                        />
                                        {errorDeclineReason && <p className="text-red-500 text-sm mt-1">{errorDeclineReason}</p>}
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            <div className="flex flex-col-reverse md:flex-row gap-3 justify-end mt-4">
                                {sendingTimer !== null ? (
                                    <Button
                                        type="button"
                                        onClick={handleCancelSending}
                                        className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center gap-4"
                                    >
                                        <span className="font-bold">ยกเลิก</span>
                                        <span className="text-xs opacity-80">จะยืนยันในอีก {sendingTimer} วินาที</span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleDecline}
                                        disabled={isSendingDeclineReason}
                                        className="w-full md:w-auto outline-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                                    >
                                        ยืนยันการสละสิทธิ์
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    onClick={() => {setOpenDeclineModal(false); handleCancelSending()}}
                                    className="w-full md:w-auto font-bold transition-all cursor-pointer bg-theme-secondary text-white hover:bg-theme-secondary-darken shadow-lg shadow-theme-secondary/20 border-none disabled:bg-theme-secondary-darken disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    เปลี่ยนใจ
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isOpenComfirmationModal && (
                    <div className="fixed inset-0 z-1001 flex items-center justify-center p-4">

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (sendingTimer !== null) return;
                                setOpenComfirmationModal(false)
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-twilight-indigo-900 border border-twilight-indigo-700 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-4 md:gap-6"
                        >
                            <h2 className="text-2xl font-bold text-white text-left w-full">ค่ามัดจำการยืนยันสิทธิ์</h2>
                            <div className="flex flex-col md:flex-row gap-x-3 gap-y-3">
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col items-center bg-white pt-5 pb-5 gap-y-5 rounded-sm max-w-[350px]">
                                        <Image src="https://storage.comcamp.io/web-assets/result/confirmation/PromptPay2.png" height={0} width={0} sizes="100%" alt="" unoptimized
                                               className="w-[50%]"
                                        />
                                        <Image src="https://storage.comcamp.io/web-assets/result/confirmation/500Baht2.png" height={0} width={0} sizes="100%" alt="" unoptimized
                                               className="w-[90%]"
                                        />
                                    </div>
                                    <span className="text-white font-medium text-xl pt-5">จำนวนเงิน 500 บาท</span>
                                </div>

                                <div className="flex flex-col gap-y-3 items-center flex-1 rounded-sm">
                                    <div className="bg-twilight-indigo-700 w-full px-4 py-3 rounded-sm text-lg grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                                        <div className="col-span-2 font-semibold text-xl mb-1">
                                            ธนาคารกสิกรไทย
                                        </div>

                                        <div className="text-gray-200">เลขที่บัญชี</div>
                                        <div className="font-semibold">217-8-87780-4</div>

                                        <div className="text-gray-200">ชื่อบัญชี</div>
                                        <div className="font-semibold">
                                            นาย ศิวัช กุตตระ และ <br className="sm:hidden" />
                                            น.ส. ณิชารีย์ สุรขะวณิชชากร
                                        </div>
                                    </div>

                                    <div className="bg-twilight-indigo-700 w-full px-4 py-3 rounded-sm text-lg text-pretty">
                                        ชำระเพื่อเป็นค่ามัดจำเท่านั้น และจะได้คืนหลังจบค่าย <br className="sm:hidden" />สามารถอ่านเพิ่มเติมเกี่ยวกับเงินมัดจำ<a className="underline-offset-3 underline font-semibold" href="../confirm-policy"  target="_blank" rel="noopener noreferrer">ได้ที่นี่</a>
                                    </div>

                                    <FileUpload
                                        url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/payment-evidence/upload`}
                                        className="h-full"
                                        height="h-full"
                                        maxSizeMB={3}
                                        uploadIcon={faReceipt}
                                        label="หลักฐานการโอนเงิน"
                                        accept="image/*"
                                        withCredentials={true}
                                        fieldName="file"
                                        additionalData={{
                                            application_id: `${applicationId}`
                                        }}
                                        onUploadSuccess={()=>{refreshApplication(); setOpenComfirmationModal(false)}}
                                    />

                                    <div className="self-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {setOpenComfirmationModal(false)}}
                                            className="cursor-pointer w-full md:w-auto border-twilight-indigo-300 text-twilight-indigo-200 hover:bg-twilight-indigo-700 hover:text-white transition-colors"
                                        >
                                            ย้อนกลับ
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div id="application-result" className={`overflow-y-hidden pt-21 px-5 md:px-10 overflow-x-hidden w-full bg-cover bg-top bg-[url(https://storage.comcamp.io/web-assets/result/background.webp)] top-0 left-0 min-h-screen`}>
                <div className="absolute w-screen overflow-x-clip left-0">
                    <div className="-top-5 left-15 w-full absolute flex flex-row justify-center z-10">
                        <div className="relative w-4xl bg-red-500">
                            <div className="scale-80 origin-top-right absolute -top-[50px] md:top-0 sm:-right-[175px] md:-right-[375px]"><Mug/></div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isLoading || ApplicationStatus?.std_application_confirm ? (
                        <>
                            { ApplicationStatus?.std_application_confirm && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    className="relative z-20 w-full min-h-[80vh] flex items-center justify-center py-20 mt-10 md:mt-20"
                                >
                                    <div className="relative max-w-6xl flex flex-col-reverse lg:flex-row gap-4 md:gap-6">
                                        {storyData && (
                                            <div className="flex-col flex gap-y-2 bg-twilight-indigo-900 rounded-2xl p-4 lg:bg-transparent lg:p-0 lg:drop-shadow-xl drop-shadow-black">
                                                <img
                                                    src={storyData.objectUrl}
                                                    alt=""
                                                    className="lg:h-[50vh] sm:w-[50%] lg:w-auto aspect-9/16 rounded-lg mx-auto"
                                                />
                                                {!storyLoading && (
                                                    <div className=" w-full flex md:flex-row flex-col flex-wrap gap-2 justify-center">
                                                        {canShare && (
                                                            <button
                                                                onClick={handleShare}
                                                                disabled={storyLoading}
                                                                className="whitespace-nowrap cursor-pointer flex-1 bg-theme-primary hover:bg-theme-primary-darken text-white pl-3 pr-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition"
                                                            >
                                                                <FontAwesomeIcon icon={faShareFromSquare} className="mr-1"/> แชร์
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={handleDownload}
                                                            disabled={storyLoading}
                                                            className={`${
                                                                canShare
                                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-300'
                                                                    : 'bg-theme-primary text-white hover:bg-theme-primary-darken'
                                                            } whitespace-nowrap cursor-pointer flex-1 pl-3 pr-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition`}
                                                        >
                                                            <FontAwesomeIcon icon={faDownload} className="mr-1"/> ดาวน์โหลด
                                                        </button>
                                                    </div>)}
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-y-10 py-5 justify-center">
                                            <div>
                                                <div className="font-bold text-4xl md:text-6xl drop-shadow-lg drop-shadow-black/40">ยืนยันสิทธิ์สำเร็จ</div>
                                                <div className="text-xl md:text-2xl font-semibold drop-shadow drop-shadow-black/35">แล้วเจอกันที่ ComCamp 37</div>
                                            </div>
                                            <div className="flex flex-col gap-y-3">
                                                <div className="font-semibold text-xl drop-shadow drop-shadow-black/35">ติดตามข่าวสารได้ที่</div>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <a
                                                        href="https://www.facebook.com/KMUTTcomcamp/" target="_blank" rel="noopener noreferrer"
                                                        className="whitespace-nowrap cursor-pointer bg-[#1877F2] text-white pl-3 pr-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition"
                                                    >
                                                        <FontAwesomeIcon icon={faSquareFacebook} className="mr-1"/> Comcamp KMUTT
                                                    </a>
                                                    <a
                                                        href="https://www.instagram.com/comcamp.kmutt/" target="_blank" rel="noopener noreferrer"
                                                        className="whitespace-nowrap cursor-pointer bg-gradient-to-r from-purple-600 to-pink-500 text-white pl-3 pr-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition"
                                                    >
                                                        <FontAwesomeIcon icon={faInstagram} className="mr-1"/> comcamp.kmutt
                                                    </a>
                                                    <a
                                                        href="https://www.tiktok.com/@comcamp.kmutt/" target="_blank" rel="noopener noreferrer"
                                                        className="whitespace-nowrap cursor-pointer bg-black text-white pl-3 pr-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition"
                                                    >
                                                        <FontAwesomeIcon icon={faTiktok} className="mr-1"/> comcamp.kmutt
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            { isLoading && (
                                <>
                                    <div className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center overflow-hidden">
                                        <motion.div
                                            variants={LoadingcontainerVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="flex flex-col items-center justify-center relative"
                                        >
                                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                                                <div className="relative z-10 w-full h-full">
                                                    <Image
                                                        src="/Comcamp-Logo.png"
                                                        alt="Loading Logo"
                                                        width={160}
                                                        height={160}
                                                        className="object-contain drop-shadow-lg drop-shadow-black/50"
                                                        priority
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-8 flex flex-col items-center">
                                                <motion.h2 className="text-xl md:text-2xl font-bold text-white/90 font-noto-sans-thai tracking-wide flex items-baseline gap-1">
                                                    <span className="drop-shadow-lg drop-shadow-black/50">กำลังโหลดข้อมูล</span>
                                                    <div className="flex gap-1 ml-1">
                                                        {[0, 1, 2].map((i) => (
                                                            <motion.span
                                                                key={i}
                                                                variants={LoadingdotVariants}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    repeat: Infinity,
                                                                    repeatType: "reverse",
                                                                    ease: "easeOut",
                                                                    delay: i * 0.15
                                                                }}
                                                                className="w-1.5 h-1.5 bg-theme-secondary rounded-full inline-block"
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.h2>
                                                <motion.p className="text-sm text-white/50 font-semibold mt-2 font-(family-name:Roboto) drop-shadow-lg drop-shadow-black/50">
                                                    อดทนรอหน่อยนะ
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="w-full flex flex-row justify-center opacity-0">
                                        <ConfirmationCard className="rotate-5 mt-[280px] translate-x-5">
                                            <></>
                                        </ConfirmationCard>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <motion.div className="w-full flex flex-row justify-center relative"
                                    key="content"
                                    initial={{ opacity: 1, y: "100vh" }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, ease: [0.231, 0.79, 0.442, 1.008] }}
                        >
                            {isMobile ? (
                                <>
                                    <div className="z-10 relative w-full px-2 sm:px-5 h-full pt-[500px] pb-[62%]">
                                        {statusResult === "waiting_for_announcement" ?
                                            (
                                                <div className="inset-x-0 h-screen relative">
                                                    <div className="absolute w-full h-full  flex flex-col items-center justify-center">
                                                        <div className="relative w-full rotate-4 flex-row justify-center items-center sm:flex hidden">
                                                            <CountdownLabel status={statusShowResult} />
                                                            <Image src="https://storage.comcamp.io/web-assets/result/TimerBG.webp" height={0} width={0} sizes="100%" alt="" unoptimized
                                                                   className="w-full scale-160"
                                                            />
                                                        </div>
                                                        <div className="relative w-full rotate-4 flex flex-row justify-center items-center sm:hidden">
                                                            <CountdownLabel status={statusShowResult} />
                                                            <Image src="https://storage.comcamp.io/web-assets/result/TimerBG_md.webp" height={0} width={0} sizes="100%" alt="" unoptimized
                                                                   className="w-full scale-150"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                        <>
                                            <div className="bg-white px-7 py-8 flex flex-row items-center justify-center gap-4 md:gap-8 lg:gap-10 overflow-hidden">
                                                <div className="font-zootopia text-5xl flex-row flex items-center justify-center gap-3 w-full text-black">
                                                    <div className="h-1.5 w-full flex-1 bg-linear-to-l from-black to-transparent"></div>
                                                    <div>Result</div>
                                                    <div className="h-1.5 w-full flex-1 bg-linear-to-r from-black to-transparent"></div>
                                                </div>
                                            </div>

                                            <Image src={current.image} height={0} width={0} sizes="100%" alt="" unoptimized
                                                   className="w-full mt-10 aspect-square border-black border-2"
                                            />

                                            <div className="mt-10 bg-white text-center py-7 px-4">
                                                <span className="text-5xl xl:text-5xl font-bold italic text-black text-pretty leading-tight">{current.bigtext}</span>
                                            </div>

                                            <div className="mt-10">
                                                <div className="text-base px-2 py-1 font-light text-black bg-white break-normal text-pretty">{current.more} {statusResult === "reserve" && (<span className="text-sm opacity-75">({formatPhoneNumber(studentInfo?.std_info_phone_number || "")})</span>)}</div>
                                            </div>

                                            { current.confirm && (
                                                <div className="mt-10 text-center flex flex-col gap-y-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setOpenComfirmationModal(true)}
                                                        className="z-20 group bg-theme-secondary hover:bg-toasted-almond-600 w-full flex-2 flex items-center justify-center px-4 rounded-xl shadow-lg cursor-pointer transition-colors border-none"
                                                    >
                                                        <span className="text-white font-bold text-xl md:leading-13.5 leading-13.5 tracking-tight font-(family-name:Roboto) ">ยืนยันสิทธิ์</span>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setOpenDeclineModal(true)}
                                                        className="z-20 group bg-theme-primary hover:bg-theme-primary-darken w-full flex-1 flex items-center justify-center px-4 rounded-xl shadow-lg cursor-pointer transition-colors border-none"
                                                    >
                                                        <span className="text-white font-bold text-xl md:leading-13.5 leading-13.5 tracking-tight font-(family-name:Roboto) ">สละสิทธิ์</span>
                                                    </motion.button>
                                                </div>
                                            )}
                                        </>)}
                                    </div>
                                    <ConfirmationCard blur className="rotate-5 mt-[280px] translate-x-5">
                                        <></>
                                    </ConfirmationCard>
                                </>
                            ) : (
                                <ConfirmationCard blur={statusResult === "waiting_for_announcement"} className="rotate-5 mt-[280px] translate-x-5">
                                    <div className="py-10 px-12 h-full">
                                        {statusResult === "waiting_for_announcement" ?
                                            (
                                                <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center">
                                                    <div className="relative w-full rotate-4 flex flex-row justify-center items-center">
                                                        <CountdownLabel status={statusShowResult} />
                                                        <Image src="https://storage.comcamp.io/web-assets/result/TimerBG.webp" height={0} width={0} sizes="100%" alt="" unoptimized
                                                            className="w-full scale-145"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                        <div className="flex items-center justify-center px-4 overflow-hidden whitespace-nowrap">
                                            <h1 className="text-3xl font-black text-black bg-[#E9E9E9] px-7 py-1 uppercase text-center">เอกสารประกาศ<br/>ผลการคัดเลือก</h1>
                                        </div>

                                        <div className="mt-15">
                                            <span className="text-lg pl-2 pr-13 py-1 font-medium text-black bg-[#E9E9E9]">สวัสดี !</span>
                                        </div>

                                        <div className="mt-2.5">
                                            <span className="text-lg pl-2 pr-13 py-1 font-light text-black bg-[#E9E9E9]">คุณ {(decodeURI(studentInfo?.std_info_first_name || "") + " " + decodeURI(studentInfo?.std_info_last_name || ""))}</span>
                                        </div>

                                        <div className="mt-15">
                                            <span className="text-lg pl-2 pr-13 py-1 font-light text-black bg-[#E9E9E9]">{current.title}</span>
                                        </div>

                                        <div className="mt-3 bg-[#E9E9E9] text-center py-7">
                                            <span className="text-5xl xl:text-5xl font-bold italic text-black">{current.bigtext}</span>
                                        </div>

                                        <div className="mt-3">
                                            <div className="text-base px-2 py-1 font-light text-black bg-[#E9E9E9] break-normal text-pretty">{current.more} {statusResult === "reserve" && (<span className="text-sm opacity-75">({formatPhoneNumber(studentInfo?.std_info_phone_number || "")})</span>)}</div>
                                        </div>

                                        { current.confirm && (
                                            <div className="mt-3 text-center flex flex-row gap-x-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setOpenComfirmationModal(true)}
                                                    className="z-20 group bg-theme-secondary hover:bg-toasted-almond-600 w-full flex-2 flex items-center justify-center px-4 rounded-xl shadow-lg cursor-pointer transition-colors border-none"
                                                >
                                                    <span className="text-white font-bold text-xl md:leading-13.5 leading-13.5 tracking-tight font-(family-name:Roboto) ">ยืนยันสิทธิ์</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setOpenDeclineModal(true)}
                                                    className="z-20 group bg-theme-primary hover:bg-theme-primary-darken w-full flex-1 flex items-center justify-center px-4 rounded-xl shadow-lg cursor-pointer transition-colors border-none"
                                                >
                                                    <span className="text-white font-bold text-xl md:leading-13.5 leading-13.5 tracking-tight font-(family-name:Roboto) ">สละสิทธิ์</span>
                                                </motion.button>
                                            </div>
                                        )}

                                        <div className="bottom-10 xl:bottom-20 px-12 left-0 absolute flex flex-row justify-between">
                                            <Image src={current.image} height={0} width={0} sizes="100%" alt="" unoptimized
                                                   className="w-[38%] aspect-square border-black border-2"
                                            />

                                            <div className="w-[40%]">
                                                <div className="bg-[#E9E9E9] text-center pt-2 pb-4 px-1.5 relative">
                                                    <div className="text-lg font-medium text-black">ด้วยความเคารพและนับถือ</div>
                                                    <div className="text-base font-light text-black">รีจอยซ์ ไม่ต้องถามว่าตัวไหน<b/>เพราะทุกตัวคือรีจอยซ์</div>

                                                    <div className="w-full scale-110 rotate-8 -left-[33%] top-[33%] absolute">
                                                        <Stamp status={current.stamp}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </>)}
                                    </div>
                                </ConfirmationCard>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative flex flex-row justify-center">
                    <div className="relative h-[250px] w-4xl ">
                        <Image src="https://storage.comcamp.io/web-assets/result/carrot.webp" height={0} width={0} sizes="100%" alt="" unoptimized
                               className="absolute md:scale-100 scale-200 w-[1000px] -left-[150px] md:-left-[500px] -rotate-42 md:rotate-0 md:-translate-y-25"
                        />
                    </div>
                </div>
                <div className="relative z-100 w-full text-center sm:text-left md:pt-3 pt-15 pb-3 text-sm leading-5 text-slate-900 justify-between flex flex-col-reverse sm:flex-row gap-x-3">
                    <div className="flex-1 text-center sm:text-right font-thin sm:hidden text-xs">{applicationId}</div>
                    <div className="flex-1 sm:mt-0 mt-2 sm:self-end">©2026 ComCamp 37. All rights reserved. <br className="lg:hidden" />Made with 🧡 by CPE39.</div>
                    <div className="flex-1 text-center sm:text-right font-thin">Background by kjpargeter / Freepik<span className="sm:block hidden">{applicationId}</span></div>
                </div>
            </div>
        </>
    )
}