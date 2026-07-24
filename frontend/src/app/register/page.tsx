'use client'

import Image from "next/image"
import { Input } from "@/components/Input"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"

type MessageType = 'Preencha todos os campos' | 'Confirmação de senha incompatível' | 'Conta criada com sucesso' | 'E-mail já cadastrado' | 'Erro no servidor'

export default function Register() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [cep, setCep] = useState("")

    const [message, setMessage] = useState<MessageType | ''>('')

    async function handleRegister(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try {
            if (!name || !email || !password || !confirmPassword || !cep) {
                setMessage('Preencha todos os campos')
                return
            } else if (password !== confirmPassword) {
                setMessage('Confirmação de senha incompatível')
                return
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name, email, password, cep
                    })
                })
                const status = response.status

                switch(status) {
                    case 201: 
                        setMessage('Conta criada com sucesso')
                        setName('')
                        setEmail('')
                        setPassword('')
                        setConfirmPassword('')
                        setCep('')
                        break
                    case 409: 
                        setMessage('E-mail já cadastrado')
                        break
                    case 500: 
                        setMessage('Erro no servidor')
                        break
                }
            }
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5 ">
            <Image src='/logo.png' alt="Logo" width={100} height={100} />
            <form className="flex flex-col gap-5 w-[90%] max-w-100">
                <div className="flex flex-col gap-2">
                    <Input placeholder="Nome Completo" onChange={(e) => setName(e.target.value)} value={name}/>
                    <Input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <Input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <Input type="password" placeholder="Confirme sua senha" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                    <Input placeholder="CEP" onChange={(e) => setCep(e.target.value)} value={cep}/>
                    {message && <p className={`${message === 'Conta criada com sucesso' ? 'text-green-200' : 'text-my-red'} "font-bold text-sm"`}>{message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Button variant="default" type="submit"
                        onClick={ async (e) => {handleRegister(e)}}
                    >Criar conta</Button>
                    <Link href="/login"><Button className="w-full" variant="outline">Já tenho uma conta</Button></Link>
                </div>
            </form>
        </div>
    )
}