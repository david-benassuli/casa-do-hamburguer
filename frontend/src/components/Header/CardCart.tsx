import type { ProductCartType } from "@/context/CartContext"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Trash2 } from "lucide-react"
import { useCart } from "@/hook/UseCart"

export function CardCart(props: ProductCartType) {

    const {setCart} = useCart()

    return (
        <div className="flex flex-row gap-2 w-full">
            <Image src={props.imgUrl} alt="Product Img" width={120} height={120} className="rounded-sm"/>
            <div className="flex flex-row items-center justify-between grow">
                <div className="flex flex-col justify-between">
                    <h2 className="text-text-dark uppercase text-2xl font-bold">{props.name}</h2>
                    <p className="text-text-low text-xl">R${props.price.toFixed(2).replace('.',',')}</p>
                    <div className="flex flex-row gap-2 items-center">
                        <button className="flex justify-center items-center p-1 bg-my-red text-text-main rounded-sm hover:cursor-pointer"
                            onClick={() => {
                                setCart(prev => prev.map(item => props.idCartItem === item.idCartItem ? {...item, amount: (item.amount > 1 ? item.amount - 1 : item.amount)} : item))
                            }}
                        ><ChevronLeft/></button>
                        <p className="text-xl">{props.amount}</p>
                        <button className="flex justify-center items-center p-1 bg-my-red text-text-main rounded-sm hover:cursor-pointer"
                            onClick={() => {
                                setCart(prev => prev.map(item => props.idCartItem === item.idCartItem ? {...item, amount: item.amount + 1} : item))
                            }}
                        ><ChevronRight/></button>
                    </div>
                </div>
                <Trash2 className="hover:cursor-pointer"
                    onClick={() => {
                        setCart(prev => prev.filter(item => item.idCartItem !== props.idCartItem))
                    }}
                />
            </div>  
        </div>
    )
}