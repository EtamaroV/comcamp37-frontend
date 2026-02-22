"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFloppyDisk, faPause, faPlay, faSignsPost,
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
import { questionAptitudeSchema } from "@/app/application/question-aptitude/schema";
import {useEffect, useState} from "react";
import axios from "axios";
import { toast } from "sonner";

import '@vidstack/react/player/styles/base.css';

import {MediaPlayer, MediaProvider, MuteButton, PlayButton, TimeSlider} from '@vidstack/react';

const prefixQuestion = "aptitude"
const postURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/question/academic/chaos/answer`

const questions = [
    { field: "question101", questionNum: 1, description: (
        <div>
            <h1 className="font-bold text-xl mb-3">ข้อ 1 : คำสาปสามสีแห่งจอมมาร</h1>
            <p>
                น้องคือผู้กล้าที่อาสามาช่วยเหลือชาวเมืองที่ถูก “พ่อมดศาสตร์มืด” ยึดครอง น้องและประชาชนรวมทั้งหมด 100 คน ถูกจับตัวไปยังลานพิธีกรรมและถูกร่ายเวทคำสาปใส่ทีละคน โดยทุกคนจะโดนสาปให้ที่คอมีอักขระต้องสาปปรากฏขึ้น เป็นสีใดสีหนึ่งใน 3 สีนี้เท่านั้น คือ สีแดง, สีเขียว, หรือ สีน้ำเงิน (สุ่มเกิดได้ทั้ง 3 สี) และเงื่อนไขมรณะมีดังนี้
            </p>
            <ul className="list-disc marker:text-gray-100 ml-3"> 
                <li>ทุกคนจะยืนเรียงแถวตอนลึกและถูกเวทย์ตรึงร่างกายไว้ ทำให้มองเห็นได้แค่อักขระของคนด้านหน้า ทั้งหมด แต่ไม่สามารถหันหลังหรือมองอักขระของตนเองได้</li>
                <li>เมื่อพิธีกรรมเริ่มขึ้น คนที่โดนคำสาปจะต้องตะโกน “ชื่อสี” อักขระของตนเองออกมาทีละคน เริ่มจากคนท้ายแถว (คนที่มองเห็นเพื่อนทุกคน) ไล่ไปจนถึงคนแรกสุด</li>
                <li>หากตอบถูก คำสาปจะสลายไป แต่หากตอบผิด คำสาปจะระเบิดและคร่าชีวิตคนคนนั้นทันที</li>
                <li>พ่อมดอนุญาตให้พวกน้องและชาวเมือง “วางแผนนัดแนะรหัสลับ” กันได้  ก่อนที่จะถูกจับไปเข้าแถวและร่ายเวทย์คำสาปใส่</li>
            </ul>
            
        </div>
        ), question: " ให้น้องอธิบายวิธีการ (Method) หรือ อัลกอริทึม (Algorithm) ที่น้องจะนัดแนะกับชาวเมือง เพื่อให้มีคนรอดชีวิตมากที่สุดเท่าที่จะทำได้ พร้อมบอกเหตุผล  (ห้ามใช้ AI ในการตอบคำถาม ให้ตอบตามความเข้าใจของน้อง)", placeholder: "ตัวอย่างคำตอบ : วิธีการคือให้ผู้กล้าที่ยืนอยู่ท้ายแถว มองสีอักขระของเพื่อนคนที่ยืนอยู่ข้างหน้าตัวเองเพียงคนเดียว ถ้าเห็นว่าเพื่อนข้างหน้าเป็นสีอะไร ก็ให้ตะโกนตอบสีนั้นออกมาเลย เช่น ถ้าเห็นเพื่อนข้างหน้าเป็นสีแดง ก็ให้ตอบว่า “แดง” ส่วนเพื่อนคนอื่น ๆ ในแถวก็ให้ทำเหมือนกัน คือให้มองสีของคนที่อยู่ข้างหน้าเรา แล้วตอบตามสีที่เราเห็นไปเรื่อย ๆ จนครบทุกคน เหตุผลที่เลือกวิธีนี้เพราะคิดว่าพ่อมดน่าจะจัดคนที่มีสีเดียวกันให้ยืนอยู่ติด ๆ กันเป็นกลุ่ม ๆ เพื่อความสวยงาม หรือถ้าเป็นการสุ่ม ก็น่าจะมีโอกาสสูงที่คนยืนติดกันจะเป็นสีเดียวกัน วิธีนี้จึงเป็นวิธีที่ง่ายที่สุดและไม่ต้องคิดเลขให้ปวดหัว แค่เชื่อมั่นในเพื่อนข้างหน้าก็พอ คาดว่าน่าจะมีคนรอดประมาณ 30-40 คน ขึ้นอยู่กับดวงว่าพ่อมดเรียงสีมาแบบไหน" },
    { field: "question102", questionNum: '101', description: (
        <div>
            คำถามสำหรับคะแนนพิเศษ :
        </div>
    ), question: "ให้น้องอธิบายวิธีการ (Method) หรือ อัลกอริทึม (Algorithm) ที่น้องจะนัดแนะกับชาวเมือง เพื่อให้มีคนรอดชีวิตมากที่สุดเท่าที่จะทำได้ พร้อมบอกเหตุผล  (ห้ามใช้ AI ในการตอบคำถาม ให้ตอบตามความเข้าใจของน้อง)", placeholder: "" },
    { field: "question201", questionNum: ' ', description: (
        /* 1.จงระบุสถานะของหอคอย X, Y และ Z ใน นาทีที่ 2 และ นาทีที่ 3 อย่างละเอียด*/
        <div>
            <h1 className="font-bold text-xl mb-3">ข้อ 2 : หอคอยสัญญาณอัฉริยะ</h1>
            <p className="indent-8">
                ในเมืองแห่งหนึ่งมีระบบป้องกันภัยพิบัติที่ทำงานด้วย <strong>"หอคอยสัญญาณอัฉริยะ"</strong> 3 หอคอย ได้แก่<strong> หอคอย X, หอคอย Y และ หอคอย Z</strong> ทั้งสามหอคอยต้องช่วยกันปล่อยโล่พลังงานเพื่อป้องกันเมือง โดยแต่ละหอคอยมี 3 สถานะ คือ
            </p>
            <div className="font-">
                🔵 Blue (ป้องกันปกติ) ใช้พลังงานต่ำ
                🟡 Yellow (เฝ้าระวัง) ใช้พลังงานปานกลาง
                🔴 Red (จู่โจม) ใช้พลังงานสูง

            </div>
            <div>
                <h1 className="font-extrabold underline my-4">กฎการทำงานของระบบ (System Logic)</h1>
                <ol className="ml-3 list-decimal [&>li]:ml-3">
                    <li>กฎความเสถียร (Stability Rule) หอคอยที่อยู่ติดกัน (X - Y และ Y - Z) ห้าม มีสถานะเป็น 🔴 Red พร้อมกันเด็ดขาด เพราะจะทำให้ระบบไฟลัดวงจร</li>
                    <li>กฎการตอบสนอง (Response Rule)
                        หอคอย X จะเปลี่ยนสถานะตาม "เซ็นเซอร์ตรวจจับฝน" เสมอ (ถ้าฝนตก X จะเป็น 🟡, ถ้าพายุเข้า X จะเป็น 🔴)<br />
                        หอคอย Y จะต้องเปลี่ยนสถานะตามสถานะ ก่อนหน้า ของหอคอย X เสมอ (เช่น ถ้านาทีก่อนหน้า X เป็น 🟡 นาทีนี้ Y ต้องเปลี่ยนเป็น 🟡)<br />
                        หอคอย Z จะมีสถานะที่ ตรงข้าม กับสถานะปัจจุบันของหอคอย Y เสมอ (ถ้า Y เป็น 🔵, Z ต้องเป็น 🔴 / ถ้า Y เป็น 🔴, Z ต้องเป็น 🔵 / ถ้า Y เป็น 🟡, Z ต้องเป็น 🟡 เหมือนกัน)</li>
                </ol>
            </div>
            <div>
                <h1 className="font-extrabold underline my-4">สถานการณ์จำลอง</h1>
                <ul className="ml-3 list-disc [&>li]:ml-3">
                    <li><strong>นาทีที่ 0 : </strong> ทุกหอคอยเริ่มต้นที่ 🔵 ( X = 🔵, Y = 🔵, Z = 🔵)</li>
                    <li><strong>นาทีที่ 1 : </strong> เซ็นเซอร์ตรวจจับได้ว่า “ฝนตก” ทำให้หอคอย X เปลี่ยนเป็น 🟡 และเริ่มเปลี่ยนสถานะตามกฎ</li>
                    <li><strong>นาทีที่ 2 : </strong> พายุเข้า 🔴</li>
                    <li><strong>นาทีที่ 3 : </strong> พายุเข้า 🔴</li>
                </ul>
            </div>

            

       <div className="relative overflow-x-auto bg-neutral-primary shadow-xs rounded-base border border-default">
            <table className="w-full text-sm text-left rtl:text-right text-body">
                <thead className="text-sm text-body border-b border-default">
                    <tr>
                        <th scope="col" className="px-6 py-3 bg-neutral-secondary-soft font-medium border-r border-default">
                            นาที (t)
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium border-r border-default">
                            สถาน X (input)
                        </th>
                        <th scope="col" className="px-6 py-3 bg-neutral-secondary-soft font-medium border-r border-default">
                            สถาน Y (input)
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium border-r border-default">
                            สถาน Z (input)
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Result
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-default">
                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft border-r border-default">
                            0
                        </th>
                        <td className="px-6 py-4 border-r border-default">
                            🔵 Blue
                        </td>
                        <td className="px-6 py-4 bg-neutral-secondary-soft border-r border-default">
                            🔵 Blue
                        </td>
                        <td className="px-6 py-4 border-r border-default">
                            🔵 Blue
                        </td>
                        <td className="px-6 py-4">
                            ปกติ
                        </td>
                    </tr>
                    <tr className="border-b border-default">
                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft border-r border-default">
                            1
                        </th>
                        <td className="px-6 py-4 border-r border-default">
                            🟡 Yellow
                        </td>
                        <td className="px-6 py-4 bg-neutral-secondary-soft border-r border-default">
                            🔵 Blue
                        </td>
                        <td className="px-6 py-4 border-r border-default">
                            🔴 Red
                        </td>
                        <td className="px-6 py-4">
                            ปกติ
                        </td>
                    </tr>
                    <tr className="border-b border-default">
                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft border-r border-default">
                            2
                        </th>
                        <td className="px-6 py-4 border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4 bg-neutral-secondary-soft border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4 border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4">
                            …
                        </td>
                    </tr>
                    <tr className="border-b border-default">
                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft border-r border-default">
                            3
                        </th>
                        <td className="px-6 py-4 border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4 bg-neutral-secondary-soft border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4 border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4">
                            …
                        </td>
                    </tr>
                    <tr className="border-b border-default">
                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft border-r border-default">
                            4
                        </th>
                        <td className="px-6 py-4 border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4 bg-neutral-secondary-soft border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4 border-r border-default">
                            …
                        </td>
                        <td className="px-6 py-4">
                            …
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

            
        </div>
    ), question: "1. จงระบุสถานะของหอคอย X, Y และ Z ใน นาทีที่ 2 และ นาทีที่ 3 อย่างละเอียด", placeholder: "" },
    { field: "question202", questionNum: ' ', description: (
        <div></div>
    ), question: "2. จากกฎข้างต้น น้องคิดว่าจะเกิด “เหตุการณ์ไฟลัดวงจร” (กฎข้อที่ 1 ถูกละเมิด) ในนาทีใดหรือไม่? หากเกิด ให้ระบุนาทีที่เกิดเหตุการณ์นั้นและอธิบายสาเหตุของปัญหา", placeholder: "" },
    { field: "question203", questionNum: ' ', description: (
        <div></div>
    ), question: "3. หากน้องเป็นวิศวกรผู้ออกแบบระบบ และพบว่ากฎเดิมทำให้เกิดอันตราย น้องจะ “แก้ไขกฎข้อใดเพียงข้อเดียว” เพื่อให้ระบบสามารถป้องกันพายุได้ (X เป็น 🔴) โดยที่ไฟไม่ลัดวงจร และหอคอย Z ยังทำงานได้? (จงอธิบายเหตุผลและความคิดสร้างสรรค์ในการแก้ปัญหา)", placeholder: "" },
    { field: "question301", questionNum: ' ', description: (
        <div>
            <h1 className="font-bold text-xl mb-3">ข้อ 3 : คดีปริศนาในม่านฝุ่น</h1>
            <p className="indent-8">มหานครแห่งหนึ่งที่อยู่ท่ามกลางพายุฝุ่นขนาดมหึมากำลังเผชิญกับวิกฤตฝุ่นพิษโดยเมื่อ “เครื่องฟอกอากาศมหาภาค” ของเมืองหยุดทำงานกะทันหันในคืน ๆ หนึ่งที่อากาศหนาวเหน็บ ทำให้ฝุ่นจากภายนอกตัวเมืองคืบคลานเข้าสู่ตัวเมือง ท่านเจ้าเมืองได้สั่งกักตัวผู้พิทักษ์ทั้ง 4 คน ที่ถูกพบเห็นและมีการบันทึกไว้ในระบบว่าอยู่ในพื้นที่ที่สามารถแก้ไขและจัดการกับเครื่องฟอกอากาศได้ เพื่อสืบสวนพยานและหาผู้อยู่เบื้องหลังเหตุการณ์ที่สร้างความอลหม่านให้กับชาวเมืองในครั้งนี้</p>
            <p className="font-extrabold underline my-4">สถานที่สำคัญ</p>
            <ol className="[&>li]:[&>span]:font-extrabold [&>li]:my-1">
                <li><span>ชั้นใต้ดิน - ห้องเซิร์ฟเวอร์ :</span> ห้องคอมพิวเตอร์หลักของเมือง ที่มีซุเปอร์เพาว์เออร์คอมพิวเตอร์ นามว่า “คอลมีอ้าซูบาซูบาซูบาเอ้ยคอมพิวเตอร์” เป็นเหมือนศูนย์กลาง</li>
                <li><span>ชั้น 1 - โถงกลาง :</span> พื้นที่ส่วนกลาง พื้นที่เปิดที่จะมีการใช้งานสำหรับผู้พิทักษ์ และผู้เยี่ยมชมทุก ๆ คนเป็นบริเวณที่จะมีความแออัดเกือบตลอดเวลา เว้นเพียงแต่ว่า ในช่วงค่ำหลังเลิกงานซึ่งไร้ผู้สัญจรไปมา สถานที่แห่งนี้ก็จะมีแต่ความเงียบสงัด บรรยากาศมีความน่าฉงนเป็นอย่างมาก
</li>
                <li><span>ชั้น 2 - ห้องควบคุมระบบ :</span> ห้องสั่งเปิด-ปิดเครื่องฟอกอากาศ ห้องควบคุมระบบการทำงานของเครื่องฟอกอากาศ ซึ่งเป็นเครื่องฟอกอากาศเครื่องแรกที่ถือกำเนิดขึ้น ที่อาจจะเป็นเครื่องสุดท้ายที่อยู่รอด เนื่องจากมีการพัฒนาระบบอยู่ตลอดเวลาและอัปเดตการทำงานจาก “คอลมีอ้าซูบาซูบาซูบาเอ้ยคอมพิวเตอร์” ทำให้ระบบมีความทันสมัย รวมถึงยังมีพลังการฟอกอากาศที่แข็งแกร่งและพร้อมที่รับได้ในทุก ๆ สถานการณ์ที่จะเกิดขึ้น ทำให้ห้องควบคุมระบบห้องนี้ เป็นห้องที่มีระบบนิรภัยขั้นสูง เพื่อป้องกันการแทรกซึมของบุคคลภายนอกและผู้ประสงค์ร้าย
</li>
                <li><span>ชั้น 3 - ห้องเครื่องจักร :</span> ห้องดูแลเครื่องกล เปรียบเสมือนโครงสร้าง Hardware ของระบบฟอกอากาศที่ต้องคอย<></>ทำนุบำรุงอยู่อย่างต่อเนื่องเพื่อไม่ให้การทำงานของเครื่องฟอกอากาศมีประสิทธิภาพที่ต่ำลงกว่าเกณฑ์มาตรฐาน
</li>
                <li><span>รอบกำแพงเมือง :</span>  พื้นที่ภายนอกตัวเมือง เป็นพื้นที่สำหรับการตรวจสอบสภาพฝุ่นภายนอกตัวเมืองเพื่อเตรียมตัวสำหรับการปรับสมดุลประสิทธิภาพของเครื่องฟอกอากาศให้สามารถทำงานได้อย่างมีประสิทธิภาพ</li>
            </ol>
            <p className="font-extrabold underline my-4">ข้อมูลสำคัญเพิ่มเติม</p>
            <p>โดยระบบการสั่งปิดเครื่องฟอกอากาศมหาภาคนี้จำเป็นต้องใช้ “รหัสพิเศษชั่วคราว” ซึ่งเปรียบเสมือนเป็นบัตรผ่านที่ทำให้ใครก็ตามที่มีบัตรนี้สามารถสั่งปิดระบบได้ โดยรหัสนี้จะสามารถสร้างได้จากเครื่องในห้องเซิร์ฟเวอร์เท่านั้นและจะไม่มีการบันทึกไว้ว่าใครเป็นคนใช้รหัสนี้ โดยต่อจากนี้เราจะเรียกรหัสอันนี้ว่า Token นอกจากนี้เมืองนี้ยังมีสิ่งที่เรียกว่า “บันทึกสมองกล” ที่จะบันทึกสิ่งต่าง ๆ ที่เกิดขึ้นในเมืองไว้อีกด้วย
</p>
            <p className="font-extrabold underline my-4">คำให้การจากผู้พิทักษ์ทั้ง 4 ว่าในช่วงเวลาเกิดเหตุ (21:50 - 22:10) อยู่ที่ไหนและทำอะไรอยู่</p>
            <div>
                <div>
                    <p className="font-extrabold my-4">พี่มด - จอมกลไก :</p>
                    <p>“ผมไม่รู้เรื่องอะไรเกี่ยวกับระบบฟอกอากาศเลยครับ ตอนแรกผมเดินไปที่กำแพงรอบเมืองเพื่อไปคุยงานกับพี่กระรอกแล้วฝุ่นมันดันเข้าตา หลังจากนั้นผมก็ลงไปล้างหน้าที่ชั้นล่างเพราะฝุ่นเข้าตาแล้วผมก็ซ่อมวาล์วอยู่ที่ชั้น 3 ตลอดนะครับ  รู้ตัวอีกทีผมก็เห็นว่าระบบฟอกอากาศได้ปิดตัวลงไปครับ”</p>
                </div>
                <div>
                    <p className="font-extrabold my-4">พี่ห่าน - ตาเพชร :</p>
                    <p>“ตอนนั้นห่านพึ่งเลิกงาน ก่อนกลับบ้านพี่เต่าให้ห่านเดินตรวจความเรียบร้อยของพื้นที่ส่วนกลาง ห่านเลยเดินดูความเรียบร้อยที่โถงกลาง ตอนประมาณ 22:05 ห่านเห็นพี่กระรอกวิ่งผ่านหน้าห้อง ห่านรู้สึกว่าท่าทางของพี่เขาจะรีบร้อนนะคะ”</p>
                </div>
                <div>
                    <p className="font-extrabold my-4">พี่กระรอก - สายฟ้า :</p>
                    <p>“ผมไม่ได้อยู่ในอาคารน่ะครับ พอดีเซนเซอร์ตรวจจับฝุ่นมันเสีย ผมเลยออกไปดูฝุ่นข้างนอกเมือง แต่ผมก็ได้พบกับพี่มดอยู่สักพักนะครับ เห็นเขาบอกว่าจะมีการตรวจสอบระบบที่ห้องวาล์วต่อ ผมได้คุยกับเขาอยู่สักพักนึงก่อนที่เขาจะแยกตัวไปเพราะฝุ่นเข้าตาครับ”</p>
                </div>
                <div>
                    <p className="font-extrabold my-4">พี่เต่า - คีย์บอร์ดด่วน :</p>
                    <p>“ผมนั่งเฝ้าจออยู่ในห้องเซิร์ฟเวอร์ชั้นใต้ดินคนเดียวครับ ระบบมัน Error บ่อย ผมเลยไม่ได้ลุกไปไหนเลย แต่ก่อนหน้าที่ระบบมันจะ Error ผมก็ได้ชี้แจ้งกับพี่ห่านว่าให้ไปตรวจสอบที่ทางเดินตรงพื้นที่ส่วนกลางนะครับ ผมเห็นว่าตอนนั้นเขากำลังจะเลิกงานพอดีก็เลยไหว้วานให้ไปตรวจสอบอีกทีครับ”</p>
                </div>
            </div>
            <div>
                <p className="font-extrabold underline my-4">บันทึกจากสมองกล</p>
                <p>21:30 - กล้องที่ชั้นที่ 3 เกิดการชำรุดมาต่อเนื่องเป็นเวลาหลายวันและยังไม่ได้มีการซ่อมแซม ทำให้ภาพที่เห็นเป็นเพียงภาพลาง ๆ<br />
                    21:50 - ที่ห้องเซิร์ฟเวอร์มีแฟลชไดรฟ์ถูกเสียบเข้ากับคอมพิวเตอร์หลักของเมืองเพื่อใช้งาน<br />
                    21:58 - มีการเปิดไฟล์ตั้งค่าระบบที่ใช้ในการควบคุมเครื่องฟอกอากาศ<br />
                    22:02 - ระบบมีการสร้าง Token ใหม่<br />
                    22:03 - ตรวจพบว่ามีคนเข้าไปในห้องควบคุม แต่ไม่สามารถระบุจำนวนได้<br />
                    22:06 - มีคำสั่งปิดเครื่องฟอกอากาศ<br />
                    22:09 - แฟลชไดรฟ์ถูกถอดออก<br />
                    21:55 ถึง 22:10 - ระบบประตูชั้น 3 ทำงานคลาดเคลื่อน
</p>
                <p className="font-extrabold underline my-4">จงตอบคำถามต่อไปนี้</p>
            </div>
        </div>
    ), question:(
        <p>1. น้องคิดว่าใครเป็นผู้ร้ายที่ปิดเครื่องฟอกอากาศ <span className="font-extrabold">ตอบเป็นชื่อของผู้ร้าย</span></p>
    ) , placeholder: "" },{ field: "question302", questionNum: ' ', description: (
        <div></div>
    ), question: (
        <p>2. อธิบายเหตุผลว่าทำไมถึงคิดเช่นนั้น <span className="font-extrabold">จงอธิบายเหตุผลอย่างละเอียดและชัดเจน</span></p>), placeholder: "" }
]

export default function questionAptitude() {
    const router = useRouter();
    const { applicationId, refreshApplication, studentAcademicChaosAnswer } = useStudent();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(questionAptitudeSchema),
        defaultValues: {
            question101: "",
            question102: "",
            question201: "",
            question202: "",
            question203: "",
            question301: "",
            question302: "",
        },
    });

    useEffect(() => {
        if (studentAcademicChaosAnswer && studentAcademicChaosAnswer.length > 0) {

            const mappedValues = studentAcademicChaosAnswer.reduce((acc, item) => {

                const index = item.std_academic_chaos_answer_section.split('_')[1];
                const key = `question${index}`;

                acc[key] = item.std_academic_chaos_answer;
                return acc;
            }, {} as Record<string, string>);

            form.reset(mappedValues);
        }
    }, [studentAcademicChaosAnswer, form.reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        const payload = {
            application_id: applicationId,
            answers: [
                { section: `${prefixQuestion}_101`, value: data.question101 },
                { section: `${prefixQuestion}_102`, value: data.question102 },
                { section: `${prefixQuestion}_201`, value: data.question201 },
                { section: `${prefixQuestion}_202`, value: data.question202 },
                { section: `${prefixQuestion}_203`, value: data.question203 },
                { section: `${prefixQuestion}_301`, value: data.question301 },
                { section: `${prefixQuestion}_302`, value: data.question302 },
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
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-twilight-indigo-800 text-white">
                                <FontAwesomeIcon icon={faSignsPost} />
                            </div>
                            <h2 className="text-xl font-bold text-white">ถอดรหัสสัญชาตญาณ</h2>
                        </div>
                        <div className="grid gap-10">
                            {questions.map((question) => (
                                <FormField
                                    key={question.field}
                                    control={form.control}
                                    name={question.field as any}
                                    render={({ field }) => (
                                        <FormItem className="w-full min-w-0">
                                            {/* 2. บังคับ FormLabel ให้กว้างไม่เกิน FormItem */}
                                            <FormLabel className="flex flex-col items-start text-base w-full min-w-0">
                                                <div className="flex flex-row items-start gap-x-2 w-full min-w-0">
                                                    {/* 3. จุดที่คลุมตาราง ต้องมี min-w-0 ด้วย ตารางถึงจะยอม Scroll */}
                                                    <div className="leading-relaxed text-pretty w-full min-w-0">
                                                        {question.description}
                                                    </div>
                                                </div>
                                                <div className={`text-pretty ${question.question === "" ? "hidden" : "block mt-4"}`}>
                                                    {question.question}
                                                </div>
                                            </FormLabel>
                                            <div className={`text-pretty ${question.placeholder === "" ? "hidden" : "block"} my-2`}>
                                                <div className="resize-none max text-pretty bg-twilight-indigo-600/20 rounded-xl md:rounded-xl border border-twilight-indigo-800 shadow-sm overflow-hidden drop-shadow-xl drop-shadow-black/20">
                                                    <h1 className="p-4">{question.placeholder}</h1>
                                                </div>
                                            </div>
                                            <FormControl>
                                                <Textarea
                                                    // placeholder={question.placeholder}
                                                    className="resize-none rounded-xl py-3 px-4 h-40 w-full"
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