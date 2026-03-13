import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import logo from "@/src/assets/logo.svg"
import { authSchema, type AuthFormValues } from "./schema";
import type { LoginParams } from "../../app/providers/AuthProvider";

const PasswordToggleButton = ({ visible, onClick }: { visible: boolean; onClick: () => void; }) =>
    <button
        type="button"
        onClick={onClick}
        className="text-muted-foreground transition hover:text-foreground cursor-pointer"
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
    >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>

interface IAuthForm {
    onLogin: (params: LoginParams) => void;
    error?: string;
}

export default function AuthForm({ onLogin, error }: IAuthForm) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            password: "",
            remember: false
        },
        mode: "onSubmit",
    });

    const onSubmit = (data: AuthFormValues) => {
        onLogin(data)
    }

    return (
        <Card className="w-full max-w-lg rounded-[28px] border-6 border-white/60 bg-card shadow-[0_22px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <CardContent className="px-10 pb-9 pt-8">
                <div className="w-full flex justify-center mb-8">
                    <div className="flex justify-center items-center w-14 h-14 bg-muted-foreground/5 rounded-full border-white border-2">
                        <img src={logo} alt="App Logo" className="w-10 h-10" />
                    </div>
                </div>

                <div className="mb-7 text-center">
                    <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-foreground">
                        Добро пожаловать!
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">Пожалуйста, авторизируйтесь</p>
                </div>

                <form id="auth-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="auth-form-username">
                                        Логин
                                    </FieldLabel>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            id="auth-form-username"
                                            aria-invalid={fieldState.invalid}
                                            type="string"
                                            className="pl-9 pr-9"
                                        />
                                        {field.value ? (
                                            <button
                                                type="button"
                                                onClick={() => form.setValue("username", "")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground cursor-pointer"
                                                aria-label="Очистить логин"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                >
                                                    <path d="M6 6l12 12" />
                                                    <path d="M18 6L6 18" />
                                                </svg>
                                            </button>
                                        ) : null}
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="auth-form-password">
                                        Пароль
                                    </FieldLabel>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            {...field}
                                            id="auth-form-password"
                                            aria-invalid={fieldState.invalid}
                                            className="pl-9 pr-9"
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition hover:text-foreground">
                                            <PasswordToggleButton
                                                visible={showPassword}
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            />
                                        </div>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="remember"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="flex flex-row items-center gap-2 space-y-0 pt-1">
                                    <Checkbox
                                        id="auth-form-remember"
                                        checked={field.value}
                                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                                        className="max-w-4 h-4 w-4 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:primary cursor-pointer"
                                    />
                                    <FieldLabel htmlFor="auth-form-remember" className="text-muted-foreground">
                                        Запомнить данные
                                    </FieldLabel>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button
                        type="submit"
                        className="h-10 w-full rounded-md bg-primary text-sm font-semibold hover:primary-hover cursor-pointer"
                    >
                        Войти
                    </Button>
                    <div className="text-center">
                        {error && <FieldError errors={[{ message: "Произошла ошибка" }]} />}
                    </div>
                </form>

                <div className="mt-5 space-y-5">
                    <div className="relative">
                        <Separator className="bg-muted-foreground z-0" />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-[12px] text-muted-foreground bg-card">
                            или
                        </span>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Нет аккаунта?{" "}
                        <button
                            type="button"
                            className="font-semibold text-primary underline underline-offset-2 hover:bg-primary-hover"
                        >
                            Создать
                        </button>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
