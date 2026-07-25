import { Router } from "express"
import { postLogin, getUsers, getUsersById, postUsers, patchUsers, putUsers, deleteUsers, getAuth, postLogout } from "./controllers/user-controller.js"
import { getProducts, getProductsById, postProduct, putProduct, patchProduct, deleteProduct } from "./controllers/product-controller.js"
import { verifyAuth } from "./middlewares/auth-middleware.js"
import { getOrder, patchOrder, postOrder } from "./controllers/order-controller.js"
import upload from "./middlewares/upload.js"

export const router = Router()

// Login | Logout
router.post('/login', postLogin)
router.post('/logout', postLogout)

// Users
router.get('/users', getUsers)
router.get('/users/:id', getUsersById)
router.post('/users', postUsers)
router.put('/users/:id', putUsers)
router.patch('/users/:id', patchUsers)
router.delete('/users/:id', deleteUsers)

// Auth
router.get('/auth', verifyAuth, getAuth)

// Products
router.get('/products', getProducts)
router.get('/products/:id', getProductsById)
router.post('/products', upload.single("image"), postProduct)
router.put('/products/:id', putProduct)
router.patch('/products/:id', patchProduct)
router.delete('/products/:id',  verifyAuth, deleteProduct)

// OrderItems
router.post('/orders', postOrder)
router.get('/orders', getOrder)
router.patch('/orders/:id', patchOrder)