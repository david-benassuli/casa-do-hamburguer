import express from 'express'
import cors from 'cors'
import cookie_parser from 'cookie-parser'
import { connection } from './src/config/prisma.js'
import { router } from './src/routes.js'

const app = express()
app.use(express.json())
app.use(cookie_parser())
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
)
app.use(router)
connection()

const PORT = process.env.PORT | 3001

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
