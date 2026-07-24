'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { TagType } from "@/components/Menu/Menu"

export type ProductType = {
  id: number
  name: string
  desc: string
  tag: TagType
  price: number
  active: boolean
  imgUrl: string,
  setProducts: Dispatch<SetStateAction<ProductType[]>>
}

type ProductsContextType = {
    products: ProductType[],
    setProducts: Dispatch<SetStateAction<ProductType[]>>
}

export const ProductsContext = createContext<ProductsContextType | null>(null)

export function ProductsProvider({children}: {children: ReactNode}) {

    const [products, setProducts] = useState<ProductType[]>([])

    return (
        <ProductsContext.Provider value={{products, setProducts}}>
            {children}
        </ProductsContext.Provider>
    )
}