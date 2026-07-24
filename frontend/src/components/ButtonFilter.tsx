import { ReactNode } from "react"

type ButtonProps = {
    type: string,
    filter: string,
    setFilter: React.Dispatch<React.SetStateAction<string>>,
    children: ReactNode
}

export function ButtonFilter(props: ButtonProps) {

    const active = props.type === props.filter

    return (
        <button className={`px-8 py-1 rounded-md font-bold hover:cursor-pointer hover:scale-102 transition-discrete duration-200 uppercase border ${active ? "bg-secondary text-bg-main" : "border-secondary text-secondary"}`} onClick={() => {
            if (active) props.setFilter("")
            else props.setFilter(props.type)
        }}>
            {props.children}
        </button>
    )
}