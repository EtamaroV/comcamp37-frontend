import { z } from "zod";

export const questionRegisSchema = z.object({
    question1: z.string().min(1, "กรุณาตอบคำถาม"),
    question2: z.string().min(1, "กรุณาตอบคำถาม"),
    question3: z.string().min(1, "กรุณาตอบคำถาม"),
    question4: z.string().min(1, "กรุณาตอบคำถาม"),
    question5: z.string().min(1, "กรุณาตอบคำถาม"),
    question6: z.string().min(1, "กรุณาตอบคำถาม"),
});