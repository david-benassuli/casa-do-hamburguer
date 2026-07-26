import bcrypt from 'bcrypt'
import { prisma } from "../config/prisma.js"
import jwt from 'jsonwebtoken'


export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await prisma.user.findFirst({
            where: {email}
        })

        if (!user) {
            res.status(404).json({ message: 'E-mail ou senha inválidos' })
            return
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid) {
            res.status(401).json({message: 'E-mail ou senha inválidos'})
            return
        }

        const userInfos = {
            id: user.id,
            name: user.name,
            email: user.email,
            cep: user.cep,
            admin: user.admin
        }

        const token = jwt.sign(userInfos, process.env.JWT_SECRET)

        res.cookie("user", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
        })

        res.status(200).json(userInfos)
    } catch (error) {
        res.status(500).json({message: 'Erro no servidor'})
    }

}

export const postLogout = async (req, res) => {
    try {
        res.clearCookie('user')
        res.status(200).json({message: 'Usuário deslogado'})

    } catch(error) {
        res.status(500).json({message: 'Erro ao deslogar usuário'})
    }
}

export const getAuth = async (req, res) => {
    try {
        const user = req.user
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: 'Erro ao autenticar usuário'})
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({ 
            select: {
                id: true,
                name: true,
                email: true,
                cep: true
            }
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: 'Falha ao consultar usuários'})
    }
}

export const getUsersById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar usuário"
        })
    }
}

export const postUsers = async (req, res) => {
    const { name, email, password, cep } = req.body

    try {

        const hash = await bcrypt.hash(password, 10)

        const user = await prisma.user.findFirst({
            where: {email}
        })
        
        if (user?.email) {
            res.status(409).json({message: 'E-mail já cadastrado'})
            return
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                cep
            },
            select: {
                id: true, 
                name: true,
                email: true,
                cep: true
            }
        })

        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({message: 'Erro ao criar usuário'})
    }
}

export const putUsers = async (req, res) => {
    const { id } = req.params
    try {
        const user = await prisma.user.update({
            where: {id},
            data: req.body,
            select: {
                id: true, 
                name: true,
                email: true,
                cep: true
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: 'Erro ao atualizar usuário'})
    }
}

export const patchUsers = async (req, res) => {
    const { id } = req.params
    try {
        const user = await prisma.user.update({
            where: {id},
            data: req.body,
            select: {
                id: true, 
                name: true,
                email: true,
                cep: true
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: 'Error ao atualizar usuário'})
    }
}

export const deleteUsers = async (req, res) => {
    const { id } = req.params
    try {
        await prisma.user.delete({
            where: {id}
        })
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({message: 'Erro ao deletar usuário'})
    }
}