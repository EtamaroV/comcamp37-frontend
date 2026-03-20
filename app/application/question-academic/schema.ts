import { z } from "zod";

export const questionAcademicSchema = z.object({
    question1: z.string().min(1, "กรุณาตอบคำถาม"),
    question201: z.string().min(1, "กรุณาตอบคำถาม"),
    question202: z.string().min(1, "กรุณาตอบคำถาม"),
    question203: z.string().min(1, "กรุณาตอบคำถาม"),
    question3: z.string().min(1, "กรุณาตอบคำถาม"),
    question4: z.string().min(1, "กรุณาตอบคำถาม"),
    question5: z.string().min(1, "กรุณาตอบคำถาม"),
    question6: z.string().min(1, "กรุณาตอบคำถาม"),
    question7: z.string().min(1, "กรุณาตอบคำถาม"),
    question8: z.string().min(1, "กรุณาตอบคำถาม"),
    question9: z.string().min(1, "กรุณาตอบคำถาม"),
    question10: z.string().min(1, "กรุณาตอบคำถาม"),
});