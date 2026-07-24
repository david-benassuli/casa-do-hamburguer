import { prisma } from "../config/prisma.js";

export const postOrder = async (req, res) => {
    const { userId, status, total, items } = req.body

    try {
        const order = await prisma.order.create({
            data: {
                userId,
                status,
                total,
                items: {
                    create: items
                }
            },
            include: {
                items: true
            }
        })

        res.status(201).json(order)
    } catch(error) {
        res.status(500).json({message: 'Erro ao adicionar item de pedido'})
    }
}

export const getOrder = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true, 
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        const formatted = orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                idCartItem: item.id,
                idProduct: item.product.id,
                name: item.product.name,
                price: item.product.price,
                amount: item.amount,
                tag: item.product.tag,
                imgUrl: item.product.imgUrl
            }))
        }))

        res.status(200).json(formatted)
    } catch(error) {
        res.status(500).json({message: 'Erro ao consultar pedidos'})
    }
}

export const patchOrder = async (req, res) => {

    const {id} = req.params
    const data = req.body

    try {
        if (data.status === 'delivered') {
            data.deliveredTime = new Date()
        } else {
            data.deliveredTime = null
        }
        const order = await prisma.order.update({
            where: {id},
            data
        })

        res.status(200).json(order)
    } catch(error) {
        res.status(500).json({message: 'Erro ao atualizar pedido'})
    }
}