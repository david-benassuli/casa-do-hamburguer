import { X } from "lucide-react";
import { CardCart } from "./CardCart";
import { useCart } from "@/hook/UseCart";
import { Dispatch, SetStateAction, useState } from "react";
import { useUser } from "@/hook/UseUser";
import { ProductCartType } from "@/context/CartContext";

type CartProps = {
    setOpenCart: Dispatch<SetStateAction<boolean>>
}

const getTotal = (cart: ProductCartType[]): number => {
    return Number(cart.map(item => item.price * item.amount).reduce((acc, cur) => acc + cur).toFixed(2))
}

export function Cart(props: CartProps) {

    const {cart, setCart} = useCart()
    const {user} = useUser()
    
    const [confirmOrder, setConfirmOrder] = useState<boolean>(false)

    async function handleAddOrders() {
        try {
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user?.id,
                    status: 'pending',
                    total: getTotal(cart),
                    items: cart.map(item => ({
                        productId: item.idProduct,
                        amount: item.amount,
                    }))
                })
            })
            const status = await orderResponse.status
            if (status === 201) {
                setCart([])
            }
        } catch (error) {
            console.log(error)
        }
    }
        

    return (
        <div className="fixed top-0 right-0 w-[30vw] max-md:w-full h-screen bg-secondary flex flex-col justify-between p-5 overflow-auto gap-5 z-1">
            <div className="flex flex-col gap-5">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-bold text-text-dark">Meu Carrinho</h2>
                    <X className="hover:cursor-pointer" onClick={() => props.setOpenCart(false)}/>
                </div>
                {cart.map(item => <CardCart key={item.idCartItem} idCartItem={item.idCartItem} idProduct={item.idProduct} name={item.name} price={item.price} amount={item.amount} tag={item.tag} imgUrl={item.imgUrl} />)}
            </div>
            <div className="flex flex-col gap-5">
                {cart.length > 0 && 
                <div className="flex flex-row justify-between text-2xl text-text-dark">
                    <p>Total</p>
                    <p>R${getTotal(cart).toFixed(2).replace('.',',')}</p>
                </div>}
                {cart.length > 0 ? (
                    confirmOrder ? 
                <div className="flex flex-row gap-2">
                    <button className="bg-my-red text-text-main p-2 grow rounded-sm hover:cursor-pointer hover:bg-my-red/90 transition-colors duration-200"
                        onClick={() => setConfirmOrder(false)}
                    >Cancelar</button>
                    <button className="bg-green-800 text-text-main p-2 grow rounded-sm 
                    hover:cursor-pointer hover:bg-green-800/90 transition-colors duration-200"
                        onClick={handleAddOrders}
                    >Confirmar</button>
                </div>
                    : 
                <button type="button" className="bg-my-red rounded-sm text-text-main p-2 hover:cursor-pointer hover:bg-my-red/90 transition-colors duration-200"
                    onClick={() => setConfirmOrder(true)}
                >FINALIZAR PEDIDO</button>
                ) : <p className="text-2xl">Carrinho vazio :(</p>}
            </div>
        </div>
    )
}