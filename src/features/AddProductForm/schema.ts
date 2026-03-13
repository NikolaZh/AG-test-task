import { z } from "zod";

export const addProductSchema = z.object({
    title: z
        .string()
        .min(2, "Введите наименование товара")
        .max(120, "Слишком длинное наименование"),
    price: z
        .string()
        .min(1, "Введите цену")
        .refine((value) => {
            const normalized = Number(value.replace(",", "."));
            return !Number.isNaN(normalized) && normalized > 0;
        }, "Цена должна быть больше 0"),
    vendor: z
        .string()
        .min(2, "Введите вендора")
        .max(80, "Слишком длинное название вендора"),
    sku: z
        .string()
        .min(3, "Введите артикул")
        .max(50, "Слишком длинный артикул"),
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;