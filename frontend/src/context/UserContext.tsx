'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export type UserType = {
    id: string,
    name: string,
    email: string,
    cep: string,
    admin: boolean
}

type UserContextType = {
    user: UserType | null,
    setUser: Dispatch<SetStateAction<UserType | null>>
}

export const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({children}: {children: ReactNode}) {

    const [user, setUser] = useState<UserType | null>(null)

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}