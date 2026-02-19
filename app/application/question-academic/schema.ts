import { z } from "zod";

export const questionAcademicSchema = z.object({
    question1: z.string().min(1, "กรุณาตอบคำถาม"),
    question2: z.string().min(1, "กรุณาตอบคำถาม"),
});