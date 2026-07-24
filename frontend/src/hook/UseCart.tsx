import { CartContext } from "@/context/CartContext";
import { useContext } from "react";

export function useCart() {
    const context = useContext(CartContext)

    if (!context) throw new Error('Os valores devem estar no provider')

    return context
}