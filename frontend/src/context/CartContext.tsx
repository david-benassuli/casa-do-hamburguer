'use client'

import { TagType } from "@/components/Menu/Menu";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export type ProductCartType = {
    idCartItem: string,
    idProduct: number,
    name: string,
    price: number,
    amount: number,
    tag: TagType
    imgUrl: string
}

type CartContextType = {
    cart: ProductCartType[],
    setCart: Dispatch<SetStateAction<ProductCartType[]>>
}

export const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({children}: {children: ReactNode}){

    const [cart, setCart] = useState<ProductCartType[]>([])

    return (
        <CartContext.Provider value={{cart, setCart}}>
            {children}
        </CartContext.Provider>
    )
}