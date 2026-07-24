'use client'

import { Header } from "@/components/Header/Header"
import { OrdersMenu } from "@/components/Orders/OrdersMenu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Orders() {

    const router = useRouter()
    
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        async function verifyAuth() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                    credentials: 'include'
                })
                const data = await response.json()
                const status = await response.status

                switch(status) {
                    case 200:
                        const admin = data.admin
                        if (admin) setLoading(false)
                        else router.replace('/')
                        break
                    case 401: 
                        router.replace('/')
                        break
                }
            } catch (error) {
                console.error(error)
            }
        }

        verifyAuth()
    }, [router])

    if (loading) {
        return (
            <p className="text-text-main text-4xl">Carregando...</p>
        )
    }

    return (
        <section className="flex flex-col gap-5">
            <Header/>
            <OrdersMenu/>
        </section>
    )
}