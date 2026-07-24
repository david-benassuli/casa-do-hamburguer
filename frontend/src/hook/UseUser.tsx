'use client'

import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export function useUser() {
    const context = useContext(UserContext)

    if (!context) throw new Error('Os valores devem estar no provider')

    return context
}