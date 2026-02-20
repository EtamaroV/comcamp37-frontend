import { z } from "zod";

export const questionAptitudeSchema = z.object({
    question1: z.string().min(1, "กรุณาตอบคำถาม"),
    question101: z.string().optional(),
    question201: z.string().min(1, "กรุณาตอบคำถาม"),
    question202: z.string().min(1, "กรุณาตอบคำถาม"),
    question203: z.string().min(1, "กรุณาตอบคำถาม"),
    question301: z.string().min(1, "กรุณาตอบคำถาม"),
    question302: z.string().min(1, "กรุณาตอบคำถาม"),
});