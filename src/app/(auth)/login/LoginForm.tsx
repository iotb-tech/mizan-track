"use client"
import { Field, Input } from "@/component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAuthInput, createAuthSchema } from "@/app/lib/validation/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";


export function LoginForm(){
    const supabase = createClient();
    const { register, handleSubmit, setError, formState: {errors, isSubmitting} } = useForm<CreateAuthInput>({
        resolver: zodResolver(createAuthSchema),
        defaultValues : {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = (data: any) => {
        console.log(data)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
                <Input id="email"  placeholder="you.....@***.com" {...register('email')} />
            </Field>
            <Field label="Password" htmlFor="password" error={errors.password?.message}>
                <Input id="password" placeholder="********" {...register('password')} />
            </Field>

        </form>
    )
}
