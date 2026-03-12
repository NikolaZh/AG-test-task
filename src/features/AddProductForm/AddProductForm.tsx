import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addProductSchema, type AddProductFormValues } from "./schema";

export type NewproductPayload = {
    title: string;
    price: number;
    vendor: string;
    sku: string;
};

const AddProductForm = () => {
    const [open, setOpen] = useState(false);

    const form = useForm<AddProductFormValues>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            title: "",
            price: "",
            vendor: "",
            sku: "",
        },
        mode: "onSubmit",
    });

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            form.reset();
        }
    };

    const onSubmit = () => {
        toast.success("Товар успешно добавлен");
        form.reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={
                <Button className="h-10 rounded-lg primary px-4 text-sm font-medium hover:primary-hover cursor-pointer">
                    <CirclePlus className="mr-2 h-6 w-6" />
                    Добавить
                </Button>}>
            </DialogTrigger>

            <DialogContent className="sm:max-w-120 bg-muted">
                <DialogHeader>
                    <DialogTitle>Добавление товара</DialogTitle>
                </DialogHeader>

                <form
                    id="add-product-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="add-product-form-title">
                                        Наименование
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="add-product-form-title"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="price"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="add-product-form-price">
                                        Цена
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="add-product-form-price"
                                        aria-invalid={fieldState.invalid}
                                        type="number"
                                        inputMode="decimal"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="vendor"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="add-product-form-vendor">
                                        Вендор
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="add-product-form-vendor"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="sku"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="add-product-form-sku">
                                        Артикул
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="add-product-form-sku"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter className="gap-2 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        form="add-product-form"
                        className="primary hover:primary-hover"
                    >
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default AddProductForm
