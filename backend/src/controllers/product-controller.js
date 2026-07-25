import { prisma } from "../config/prisma.js"
import cloudinary from "../config/cloudinary.js"

export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                id: 'asc'
            }
        })
        res.status(200).json(products)
    } catch(error) {
        res.status(500).json({message: 'Falha ao consultar os produtos', error: error.message})
    }
}

export const getProductsById = async (req, res) => {
    const { id } = req.params

    try {
        const products = await prisma.product.findUnique({
            where: { id }
        })
        res.status(200).json(products)
    } catch(error) {
        res.status(500).json({message: 'Produto não encontrado'})
    }
}

export const postProduct = async (req, res) => {
    try {
        const { name, desc, tag, price } = req.body

        const product = await prisma.product.findUnique({
            where: {name}
        })
        if (product?.name) {
            res.status(409).json({message: 'Já existe um produto com esse nome'})
            return
        }
        
        if (!req.file) {
            return res.status(400).json({message: "Imagem é obrigatória."});
        }

        const base64 = req.file.buffer.toString("base64");

        const dataURI = `data:${req.file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "products"
        });

        const newProduct = await prisma.product.create({
            data: {
                name, 
                desc,
                tag,
                price: Number(price),
                imgUrl: result.secure_url
            }
        })

        res.status(201).json(newProduct)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Erro ao criar produto'})
    }
}

export const putProduct = async (req, res) => {

    const { id } = req.params

    try {

        const product = await prisma.product.update({
            where: {id},
            data: req.body
        })
        res.status(200).json(product)
    } catch(error) {
        res.status(500).json({message: 'Erro ao atualizar produto'})
    }
}

export const patchProduct = async (req, res) => {

    const id  = Number(req.params.id)

    try {

        const product = await prisma.product.update({
            where: {id},
            data: req.body
        })
        res.status(200).json(product)
    } catch(error) {
        res.status(500).json({message: 'Erro ao atualizar produto'})
    }
}

export const deleteProduct = async (req, res) => {
    const id = Number(req.params.id)
    console.log('id:',id)
    
    try {
        const admin = req.user.admin

        if (admin) {
            console.log(1)
            const product = await prisma.product.delete({
                where: {id}
            })
            console.log(2)
            res.status(200).json(product)
            console.log(3)
        } else {
            res.status(401).json({message: 'Requisição não autorizada'})
            console.log(4)
        }
    } catch (error) {
        console.error("ERRO AO DELETAR:");
        console.error(error);

        res.status(500).json({
            message: "Erro ao deletar produto",
            error: error.message
        });
    }
}
