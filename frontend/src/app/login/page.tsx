'use client'

import Image from "next/image"
import { Input } from "@/components/Input"
import Link from "next/link"
import { Button } from "@/components/Button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hook/UseUser"

type MessageType = 'Login feito com sucesso' | 'Preencha todos os campos' | 'E-mail ou senha inválidos' | 'Erro no servidor' 

export default function Login() 
{
    const router = useRouter()

    const [loading, setLoading] = useState(true)

        useEffect(() => {
            async function verifyAuth() {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                        credentials: 'include'
                    })

                    if (response.ok) {
                        router.replace('/')
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                }
            }

            verifyAuth()
        }, [router])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [message, setMessage] = useState<MessageType | ''>('')

    const {setUser} = useUser()


    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try {
            if (!email || !password) {
                setMessage('Preencha todos os campos')
                return
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email, password
                }),
                credentials: "include"
            })
            const data = await response.json()
            const status = response.status
            switch(status) {
                case 200: 
                    setMessage('Login feito com sucesso')
                    setUser(data)
                    router.push('/')
                    break
                case 401: 
                    setMessage('E-mail ou senha inválidos')
                    break
                case 404: 
                    setMessage('E-mail ou senha inválidos')
                    break
                case 500: 
                    setMessage('Erro no servidor')
                    break
            }
        } catch(error) {
            console.error(error)
        }
    }

    if (loading) {
        return (
            <p className="text-text-main text-4xl">Carregando...</p>
        )
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5 ">
            <Image src='/logo.png' alt="Logo" width={100} height={100} />
            <form className="flex flex-col gap-5 w-[90%] max-w-100">
                <div className="flex flex-col gap-2">
                    <Input placeholder="E-mail" type="email" onChange={(e) => setEmail(e.target.value)}/>
                    <Input placeholder="Senha" type="password" onChange={(e) => setPassword(e.target.value)}/>
                    {message && <p className={`${message === 'Login feito com sucesso' ? 'text-green-200' : 'text-my-red'} "font-bold text-sm"`}>{message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Link href='/'><Button variant="default" type="submit"
                        onClick={(e) => {handleSubmit(e)}}
                    >Login</Button></Link>
                    <Link href='/register'><Button variant="outline">Não tenho uma conta</Button></Link>
                </div>
            </form>
        </div>
    )
}