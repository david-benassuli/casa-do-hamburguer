import { ReactNode } from "react"

type ButtonProps = {
    variant: "default" | "outline",
    children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
    return (
        <button {...props} className={`${ props.variant === "default" ? "bg-my-red text-text-main" : "bg-text-main text-my-red border border-my-red"} h-10 rounded-md hover:cursor-pointer hover:scale-102 duration-200 w-full`}>{props.children}</button>
    )
}