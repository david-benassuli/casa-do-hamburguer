'use client'

import { useUser } from "@/hook/UseUser"
import Image from "next/image"
import Link from "next/link"

import { LogOut, ShoppingCart, Plus, Box, LayoutDashboard, Menu, X, UserRound, ChevronRight, Hamburger } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "@/hook/UseCart"
import { Cart } from "./Cart"
import { AddProduct } from "./AddProduct"

export function Header() {

    const {user, setUser} = useUser()
    const pathname = usePathname()

    const [openCart, setOpenCart] = useState<boolean>(false) 
    const [openAddProduct, setOpenAddProduct] = useState<boolean>(false)

    const [openOptions, setOpenOptions] = useState<boolean>(false)

    const {cart} = useCart()

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
                <>
                    <div className="flex flex-row items-center gap-10 max-md:hidden">
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
                    {!openOptions && <Menu className="md:hidden text-text-main hover:cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenOptions(true)}/>}
                </>
            : 
                <Link href='/login'>
                    <button type="button" className={`px-8 py-1 rounded-md font-bold bg-secondary text-bg-main hover:cursor-pointer hover:scale-102 duration-200`}
                    >Entrar</button>
                </Link>
            }
            {openOptions && user &&
                <div className="md:hidden h-screen w-screen bg-bg-main/95 absolute top-0 left-0 p-4 flex flex-col gap-5">
                    <header className="flex flex-row justify-between items-center">
                        <Image src={'/logo.png'} alt="Logo image" width={100} height={100}/>
                        <X className="text-text-main hover:cursor-pointer" onClick={() => setOpenOptions(false)}/>
                    </header>
                    <div className="flex flex-row items-center gap-4">
                        <UserRound className="border-2 rounded-full border-secondary text-secondary w-15 h-15" />
                        <div className="flex flex-col justify-between">
                            <p className="text-text-main text-[clamp(1rem,5vw,1.5rem)]">Olá, {user.name}</p>
                            <p className="text-text-low text-[clamp(0.8rem,5vw,1.rem)]">Que bom te ver por aqui!</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between group hover:cursor-pointer" onClick={() => setOpenOptions(false)}>
                        <div className="flex flex-row items-center gap-4">
                            <Hamburger className="bg-secondary/20 text-secondary p-2 rounded-md w-15 h-15" />
                            <div className="flex flex-col justify-between">
                                <p className="text-text-main text-[clamp(1rem,5vw,1.5rem)]">Produtos</p>
                                <p className="text-text-low text-[clamp(0.8rem,5vw,1.rem)]">Ver produtos</p>
                            </div>
                        </div>
                        <ChevronRight className="-translate-x-10 group-hover:-translate-x-2 duration-200 text-xl text-secondary max-[420px]:hidden" />
                    </div>
                    <div className="flex flex-row items-center justify-between group hover:cursor-pointer" onClick={() => setOpenCart(true)}>
                        <div className="flex flex-row items-center gap-4">
                            <ShoppingCart className="bg-secondary/20 text-secondary p-2 rounded-md w-15 h-15" />
                            <div className="flex flex-col justify-between">
                                <div className="text-[clamp(1rem,5vw,1.5rem)] flex flex-row gap-2 items-center">
                                    <p className="text-text-main">Carrinho</p>
                                    <p className="p-1 text-text-dark bg-secondary rounded-full w-6 h-6 flex items-center justify-center">{cart.length > 0 ? cart.map(item => item.amount).reduce((acc, cur) => acc + cur) : 0}</p>
                                </div>
                                <p className="text-text-low text-[clamp(0.8rem,5vw,1.rem)]">Veja os itens do seu carrinho</p>
                            </div>
                        </div>
                        <ChevronRight className="-translate-x-10 group-hover:-translate-x-2 duration-200 text-xl text-secondary max-[420px]:hidden" />
                    </div>
                    <div className="flex flex-row items-center justify-between group hover:cursor-pointer" onClick={() => setOpenAddProduct(true)}>
                        <div className="flex flex-row items-center gap-4">
                            <Plus className="bg-secondary/20 text-secondary p-2 rounded-md w-15 h-15" />
                            <div className="flex flex-col justify-between">
                                <p className="text-text-main text-[clamp(1rem,5vw,1.5rem)]">Novo Produto</p>
                                <p className="text-text-low text-[clamp(0.8rem,5vw,1.rem)]">Adicione um novo produto</p>
                            </div>
                        </div>
                        <ChevronRight className="-translate-x-10 group-hover:-translate-x-2 duration-200 text-xl text-secondary max-[420px]:hidden" />
                    </div>
                    <button type="button" onClick={handleLogout}
                        className="text-secondary bg-secondary/20 flex items-center justify-center gap-4 p-4 rounded-md hover:cursor-pointer"
                    ><LogOut/> <p>Sair da conta</p></button>
                </div>
            }

            {openCart && <Cart setOpenCart={setOpenCart}/>}
            {openAddProduct && <AddProduct setOpenAddProduct={setOpenAddProduct}/>}
        </header>
    )
}