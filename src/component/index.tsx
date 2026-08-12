import { error } from "console";
import { forwardRef, type ReactNode } from "react";

export function Field({ label,  htmlFor, children, error }: {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}){
    return (
        <div className="">
            <label className="text-[16px] font-semibold  text-neutral-800" htmlFor={htmlFor} >{label}</label>
            {children}

            {error && (
                <p className="text-error" role="alert">{error}</p>
            )}
        </div>
    )
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function Input({...prop}, ref){
        return <input ref={ref} className="w-full border-b focus:border-b focus-within:outline-0 px-2 py-[0.9] mt-3 border-b-primary-300 mb-2 " {...prop} />;
    }
)


export function Button({...prop}){

    return <button className="bg-primary-500 px-3 py-1 text-center mb-5 text-xl w-full rounded-2xl " {...prop} />
}