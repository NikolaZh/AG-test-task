import { z } from "zod";

export const authSchema = z.object({
    username: z
        .string()
        .min(3, "Логин должен содержать минимум 3 символа")
        .max(50, "Слишком длинный логин"),
    password: z
        .string()
        .min(6, "Пароль должен содержать минимум 6 символов")
        .max(100, "Слишком длинный пароль"),
    remember: z.boolean(),
});

export type AuthFormValues = z.infer<typeof authSchema>;