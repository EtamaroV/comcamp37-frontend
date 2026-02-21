"use client";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft, faDownload,
    faFaceLaughBeam, faFileLines, faFloppyDisk,
    faFolderOpen,
    faGraduationCap,
    faIdCard, faPersonBreastfeeding,
    faSchool,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import FileUpload from "@/app/application/file/FileUpload";

import {useStudent, StudentInfo} from "@/contexts/StudentContext";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {useRouter} from "next/navigation";

export default function fileUploadPage() {
    const router = useRouter();

    const {applicationId, refreshApplication} = useStudent();

    const fileUploadData = [
        { type: "file_face", accept: ".png,.jpg,.jpeg", label: "รูปถ่ายหน้าตรง", description: "เป็นไฟล์รูปภาพที่เห็นใบหน้าชัดเจน", fileSize: 3, icon: faFaceLaughBeam},
        { type: "file_national_id", accept: ".png,.jpg,.jpeg,.pdf", label: "สำเนาบัตรประชาชน", description: (<>สามารถใช้สำเนาบัตรนักเรียนแทนได้ <b>(เซ็นสำเนาถูกต้อง)</b></>), fileSize: 3, icon: faIdCard},
        { type: "file_pp_1", accept: ".png,.jpg,.jpeg,.pdf", label: "สำเนาระเบียนแสดงผลการเรียน (ปพ.1)", description: (<>สามารถใช้เอกสารแสดงผลการเรียนภาคการศึกษาล่าสุดแทนได้ <b>(เซ็นสำเนาถูกต้อง - ต้องมีผลการเรียน GPAX)</b></>), fileSize: 3, icon: faFileLines},
        { type: "file_pp_7", accept: ".png,.jpg,.jpeg,.pdf", label: "สำเนาใบรับรองสถานภาพการเป็นนักเรียน (ปพ.7)", description: (<>สามารถใช้เอกสารรับรองการเป็นนักเรียนแทนได้ เช่น สำเนาบัตรนักเรียน <b>(เซ็นสำเนาถูกต้อง)</b></>), fileSize: 3, icon: faGraduationCap},
        { type: "file_parent_permission", accept: ".png,.jpg,.jpeg,.pdf", label: "เอกสารขออนุญาตผู้ปกครอง", description: (<a className="underline" href="https://storage.comcamp.io/web-assets/เอกสารขออนุญาตผู้ปกครอง.pdf" download="เอกสารขออนุญาตผู้ปกครอง.pdf" target="_blank"><FontAwesomeIcon icon={faDownload} /><b>กดที่นี่เพื่อดาวน์โหลดไฟล์เอกสารขออนุญาตผู้ปกครอง</b></a>), fileSize: 3, icon: faPersonBreastfeeding}
    ]

    return (
        <main className="flex-1 w-full max-w-[1280px] mx-auto py-6 md:px-6 md:py-10">
            <div className="mb-6 flex flex-col gap-2 px-4 md:px-0">
                <h1 className="text-white tracking-tight text-3xl font-bold leading-tight">ยื่นหลักฐานเข้าเมือง</h1>
            </div>

            <div className="bg-slate-900 rounded-[40px] md:rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 gap-6 flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-slate-800 text-white">
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </div>
                        <h2 className="text-xl font-bold text-white">อัปโหลดเอกสาร</h2>
                    </div>
                    <div className="grid xl:grid-cols-2 gap-10">

                        {fileUploadData.map((item) => (
                        <div key={item.type} className="col-span-1 flex flex-col gap-y-2">
                            <div>
                                <div className="font-bold">{item.label}</div>
                                <div className="text-sm opacity-80">{item.description}</div>
                            </div>
                            <FileUpload
                                url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/file/upload`}
                                fetchUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application/file/${applicationId}/${item.type}`}

                                maxSizeMB={item.fileSize}
                                uploadIcon={item.icon} // เปลี่ยนไอคอนตรงนี้
                                label={item.label}
                                accept={item.accept}
                                withCredentials={true}

                                additionalData={{
                                    id: `${applicationId}`,
                                    type: item.type
                                }}

                                onUploadSuccess={()=>{refreshApplication()}}
                            />

                        </div>
                        ))}

                    </div>

                </div>

                <div
                    className="p-6 md:p-8 border-t border-slate-800 bg-slate-900/50 flex flex-col-reverse sm:flex-row justify-end gap-4">
                    <Button
                        type="button"
                        className="px-8 py-5 font-bold rounded-xl bg-primary hover:bg-primary/90 focus:ring-offset-slate-900"
                        onClick={()=>{router.push("/application")}}
                    >
                        เสร็จสิ้น
                    </Button>
                </div>
            </div>

        </main>
    );
}