'use client'

import { ProductsContext } from "@/context/ProductsContext";
import { useContext } from "react";

export function useProducts() {
    const context = useContext(ProductsContext)

    if (!context) throw new Error('Os valores devem estar no provider')

    return context
}