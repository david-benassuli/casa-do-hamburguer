import jwt from 'jsonwebtoken'

export const verifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies.user
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch(error) {
        console.error(error)
        res.status(401).json({message: "Usuário não autenticado"})        
    }
}