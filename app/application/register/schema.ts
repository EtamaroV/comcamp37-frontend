import { z } from "zod";

// --- Helper สำหรับตรวจสอบเบอร์โทร (10 หลัก) ---
const phoneRegex = /^0\d{9}$/;

const thaiRegex = /^[ก-๙\s]+$/;

// --- Step 1: ข้อมูลส่วนตัว ---
export const Step1Schema = z.object({
    name_prefix: z.string().min(1, "กรุณาเลือก"),
    name_first: z.string()
        .min(1, "กรุณาระบุชื่อจริง")
        .regex(thaiRegex, "กรุณาระบุเป็นภาษาไทยเท่านั้น"),

    name_last: z.string()
        .min(1, "กรุณาระบุนามสกุล")
        .regex(thaiRegex, "กรุณาระบุเป็นภาษาไทยเท่านั้น"),

    name_nick: z.string()
        .min(1, "กรุณาระบุชื่อเล่น")
        .regex(thaiRegex, "กรุณาระบุเป็นภาษาไทยเท่านั้น"),

    // วันเกิดรับเป็น Date object
    info_dob: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        return arg;
    }, z.date({
        error: "กรุณาเลือกวันเดือนปีเกิด",
    }).refine((date) => !isNaN(date.getTime()), {
        message: "รูปแบบวันที่ไม่ถูกต้อง",
    })),

    info_gender: z.enum(["male", "female"], {
        error: "กรุณาเลือกเพศของคุณ"
    }),
    info_religion: z.string().min(1, "กรุณาเลือกศาสนา"),

    info_phone: z.string().regex(phoneRegex, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและต้องขึ้นต้นด้วยเลข 0"),
    info_address: z.string().min(1, "กรุณาระบุที่อยู่"),
});

// --- Step 2: ข้อมูลการศึกษาและสุขภาพ ---
export const Step2Schema = z.object({
    academic_level: z.string().min(1, "กรุณาเลือกระดับชั้น"),
    academic_program: z.string().min(1, "กรุณาเลือกแผนการเรียน"),
    academic_program_other: z.string().optional(), // อาจจะว่างได้ถ้าไม่ได้เลือกอื่น ๆ
    academic_school: z.string().min(1, "กรุณาระบุชื่อโรงเรียน"),

    grade_gpax: z.string().min(1, { message: "กรุณาระบุเกรดเฉลี่ย" })
        .regex(/^\d(\.\d{0,2})?$/, { message: "รูปแบบเกรดไม่ถูกต้อง" })
        .refine((val) => {
            const num = parseFloat(val);
            return num >= 0 && num <= 4.00;
    }, { message: "เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00" }),

    grade_math: z.string().min(1, { message: "กรุณาระบุเกรดเฉลี่ย" })
        .regex(/^\d(\.\d{0,2})?$/, { message: "รูปแบบเกรดไม่ถูกต้อง" })
        .refine((val) => {
            const num = parseFloat(val);
            return num >= 0 && num <= 4.00;
        }, { message: "เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00" }),

    grade_sci: z.string().min(1, { message: "กรุณาระบุเกรดเฉลี่ย" })
        .regex(/^\d(\.\d{0,2})?$/, { message: "รูปแบบเกรดไม่ถูกต้อง" })
        .refine((val) => {
            const num = parseFloat(val);
            return num >= 0 && num <= 4.00;
        }, { message: "เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00" }),

    grade_eng: z.string().min(1, { message: "กรุณาระบุเกรดเฉลี่ย" })
        .regex(/^\d(\.\d{0,2})?$/, { message: "รูปแบบเกรดไม่ถูกต้อง" })
        .refine((val) => {
            const num = parseFloat(val);
            return num >= 0 && num <= 4.00;
        }, { message: "เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00" }),

    health_bloodType: z.enum(["A", "B", "O", "AB"], {
        error: "กรุณาเลือกหมู่เลือด"
    }),
    health_medicalRights: z.string().min(1, "กรุณาระบุสิทธิการรักษา"),
    health_chronicDiseases: z.string().min(1, "กรุณาระบุ (ถ้าไม่มีให้ขีด -)"),
    health_drugAllergies: z.string().min(1, "กรุณาระบุ (ถ้าไม่มีให้ขีด -)"),
    health_dietaryRestrictions: z.string().min(1, "กรุณาระบุ (ถ้าไม่มีให้ขีด -)"),
    health_more: z.string().optional(), // ไม่บังคับ
}).superRefine((data, ctx) => {
    // Logic: ถ้าแผนการเรียนเป็น "อื่น ๆ" ต้องกรอกช่อง academic_program_other
    if (data.academic_program === "อื่น ๆ" && !data.academic_program_other) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณาระบุแผนการเรียน",
            path: ["academic_program_other"],
        });
    }
});

// --- Step 3: ผู้ปกครอง, ความพร้อม, เสื้อ ---
export const Step3Schema = z.object({
    guardian_name: z.string()
        .min(1, "กรุณาระบุชื่อผู้ปกครอง")
        .regex(thaiRegex, "กรุณาระบุเป็นภาษาไทยเท่านั้น"),
    guardian_relationship: z.string().min(1, "กรุณาระบุความสัมพันธ์"),
    guardian_phone: z.string().regex(phoneRegex, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและต้องขึ้นต้นด้วยเลข 0"),

    availability_haveAttended: z
        .string()
        .min(1, "กรุณาเลือกคำตอบ")
        .refine((val) => val === "true" || val === "false", {
            message: "กรุณาเลือกคำตอบ",
        }),
    availability_attendAllDays: z
        .string()
        .min(1, "กรุณาเลือกคำตอบ")
        .refine((val) => val === "true" || val === "false", {
            message: "กรุณาเลือกคำตอบ",
        }),

    availability_laptop: z
        .string()
        .min(1, "กรุณาเลือกคำตอบ")
        .refine((val) => val === "true" || val === "false", {
            message: "กรุณาเลือกคำตอบ",
        }),
    availability_tablet: z
        .string()
        .min(1, "กรุณาเลือกคำตอบ")
        .refine((val) => val === "true" || val === "false", {
            message: "กรุณาเลือกคำตอบ",
        }),
    availability_mouse: z
        .string()
        .min(1, "กรุณาเลือกคำตอบ")
        .refine((val) => val === "true" || val === "false", {
            message: "กรุณาเลือกคำตอบ",
        }),

    availability_laptopOS: z.string().optional(),
    availability_laptopOS_other: z.string().optional(),

    availability_travelPlan: z.string().min(1, "กรุณาระบุวิธีการเดินทาง"),
    apparel_size: z.string().min(1, "กรุณาเลือกไซซ์เสื้อ"),

    // File fields (ถ้าจะ Validate ไฟล์ต้องทำ Custom แต่เบื้องต้นใส่ไว้กัน Type Error)
    file_facePhoto: z.any().optional(),
    file_idCardCopy: z.any().optional(),
    file_parentPermission: z.any().optional(),
    file_transcript: z.any().optional(),
    file_studentStatus: z.any().optional(),
}).superRefine((data, ctx) => {
    if (data.availability_laptop === "true" && !data.availability_laptopOS) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณาเลือก OS",
            path: ["availability_laptopOS"],
        });
    }

    // ถ้า OS เป็น Linux หรือ อื่น ๆ ต้องระบุเพิ่ม
    if (
        (data.availability_laptopOS === "Linux" || data.availability_laptopOS === "อื่น ๆ") &&
        !data.availability_laptopOS_other
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "กรุณาระบุรายละเอียด",
            path: ["availability_laptopOS_other"],
        });
    }
});

// --- รวมร่างเป็น FormDataSchema ใหญ่ (ใช้ตอนสุดท้ายหรือใช้ Type) ---
export const FormDataSchema = Step1Schema.merge(Step2Schema).merge(Step3Schema);

export type FormData = z.infer<typeof FormDataSchema>;