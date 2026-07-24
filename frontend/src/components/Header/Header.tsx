'use client'

import { useUser } from "@/hook/UseUser"
import Image from "next/image"
import Link from "next/link"

import { LogOut, ShoppingCart, Plus, Box, LayoutDashboard, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/hook/UseCart"
import { CardCart } from "./CardCart"
import { Cart } from "./Cart"
import { AddProduct } from "./AddProduct"

export function Header() {

    const {user, setUser} = useUser()
    const pathname = usePathname()

    const [openCart, setOpenCart] = useState<boolean>(false) 
    const [openAddProduct, setOpenAddProduct] = useState<boolean>(false)

    const {cart, setCart} = useCart()

    function getNavItemClass(path: string) {
        const baseClass = "flex justify-center items-center border rounded-md w-[35px] h-[35px] hover:cursor-pointer transition-colors duration-200 "
        return baseClass + (pathname === path ? 'bg-secondary text-black' : 'border-secondary text-secondary hover:text-text-main')
    }

    async function handleAuth() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                credentials: "include"
            })
            const data = await response.json()
            const status = await response.status
            if (status === 200) {
                setUser(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleAuth()
    }, [])

    async function handleLogout() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                credentials: "include"
            })
            const status = await response.status

            if (status === 200) {
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <header className="flex flex-row justify-between items-center w-full">
            <Image src='/logo.png' alt="Logo" width={100} height={100} />

            {user ? 
                <div className="flex flex-row items-center gap-10">
                    {user.admin && <div className="flex flex-row gap-2 ">
                        <Link href={"/"}>
                            <div className={getNavItemClass('/')}>
                                <Box size={18}/>
                            </div>
                        </Link>
                        <Link href={"/orders"}>
                            <div className={getNavItemClass('/orders')}>
                                <LayoutDashboard size={18}/>
                            </div>
                        </Link>
                        <div className={getNavItemClass('/plus')}>
                            <Plus size={18} onClick={() => setOpenAddProduct(true)}/>
                        </div>
                    </div>}
                    <div className="relative">
                        <ShoppingCart className="text-text-main hover:cursor-pointer hover:text-secondary transition-colors duration-200" onClick={() => setOpenCart(true)}/>
                        <p className="absolute bg-secondary flex justify-center items-center w-5 h-5 rounded-full -top-3 -right-3 ">{cart.length > 0 ? cart.map(item => item.amount).reduce((acc, cur) => acc + cur) : 0}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-text-main font-bold">Olá, {user.name}</p>
                        <LogOut className="text-secondary hover:cursor-pointer hover:text-text-main transition-colors duration-200"
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            : 
                <Link href='/login'>
                    <button type="button" className={`px-8 py-1 rounded-md font-bold bg-secondary text-bg-main hover:cursor-pointer hover:scale-102 duration-200`}
                    >Entrar</button>
                </Link>
            }

            {openCart && <Cart setOpenCart={setOpenCart}/>}
            {openAddProduct && <AddProduct setOpenAddProduct={setOpenAddProduct}/>}
        </header>
    )
}