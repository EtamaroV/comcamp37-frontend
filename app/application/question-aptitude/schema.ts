import { z } from "zod";

export const questionAptitudeSchema = z.object({
    question1: z.string().min(1, "กรุณาตอบคำถาม"),
    question2: z.string().min(1, "กรุณาตอบคำถาม"),
});