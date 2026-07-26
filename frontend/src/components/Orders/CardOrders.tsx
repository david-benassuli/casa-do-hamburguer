import { ChevronDown, User, Calendar, Clock } from "lucide-react"
import { OrderType, StatusOrderType } from "./OrdersMenu"
import { Dispatch, SetStateAction, useState } from "react"
import { ProductCartType } from "@/context/CartContext"
import Image from "next/image"

type CardOrdersType = {
    id: number, 
    orderId: string,
    name: string,
    orderTime: Date,
    deliveredTime?: Date,
    status: StatusOrderType,
    total: number,
    items: ProductCartType[],
    setOrders: Dispatch<SetStateAction<OrderType[]>>
}

const getStatus = (status: StatusOrderType) => {
    if (status === 'pending') return 'Pendente'
    if (status === 'delivered') return 'Entregue'
    if (status === 'canceled') return 'Cancelado'
}

export function CardOrders(props: CardOrdersType) {
    const [flipped, setFlipped] = useState(false);
    
    const handleChangeOrderStatus = async (status: StatusOrderType) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${props.orderId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    status
                })
            })
            const data = await response.json()
            
            if(response.ok) {
                props.setOrders(prev => prev.map(item => item.id === props.orderId ? {...item, status: data.status, deliveredTime: data.deliveredTime } : item))
            }
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className="w-70 h-48 perspective-[1000px] cursor-pointer" onClick={() => setFlipped(!flipped)}>
            <div className={`relative w-full h-full duration-500 transform-3d
      ${flipped ? "transform-[rotateY(180deg)]" : ""}`}>
                <div className="absolute inset-0 backface-hidden text-text-dark bg-secondary rounded-sm p-2 flex flex-col gap-2 overflow-auto">
                    <div className="flex flex-row justify-between gap-2">
                        <h2 className="text-black text-xl font-semibold">#{props.id}</h2>
                        <div className="flex flex-row gap-2">
                            {getStatus(props.status)}
                            <ChevronDown/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="flex flex-row gap-2"><User/>{props.name}</p>
                        <p className="flex flex-row gap-2"><Calendar/>{`${new Date(props.orderTime).toLocaleDateString('pt-BR')}`}</p>
                        <div className="flex flex-row justify-between gap-2 flex-wrap">
                            <p className="flex flex-row gap-2"><Clock/>{`${new Date(props.orderTime).toLocaleTimeString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"})}`}</p>
                            <p className="flex flex-row gap-2"><Clock/>{props.deliveredTime ? `${new Date(props.deliveredTime).toLocaleTimeString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"})}` : "-" }</p>
                        </div>
                    </div>
                    <hr className="w-full h-2"/>
                    <div className="flex flex-row justify-between">
                        <p className="text-xl font-bold">Total</p>
                        <p className="text-xl self-end">R${props.total.toFixed(2).replace('.',',')}</p>
                    </div>
                </div>
                <div className="absolute inset-0 rounded-sm bg-secondary p-2
                    transform-[rotateY(180deg)]
                    backface-hidden overflow-auto flex flex-col gap-2">
                    <div className="flex flex-row justify-between max-[300px]:flex-col gap-1 flex-wrap">
                        <button className="p-1 border border-my-red text-my-red rounded-sm hover:scale-95 transition-discrete duration-200 hover:cursor-pointer" 
                        onClick={() => {
                            handleChangeOrderStatus('canceled')
                        }}>Cancelar</button>
                        <button className="p-1 border border-my-yellow text-my-yellow rounded-sm hover:scale-95 transition-discrete duration-200 hover:cursor-pointer" 
                        onClick={() => {
                            handleChangeOrderStatus('pending')
                        }}>Pendente</button>
                        <button className="p-1 border border-my-green text-my-green rounded-sm hover:scale-95 transition-discrete duration-200 hover:cursor-pointer" 
                        onClick={() => {
                            handleChangeOrderStatus('delivered')
                        }}>Entregue</button>
                    </div>
                    {props.items.map((item, index) => 
                        <div key={index}>
                            
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-2">
                                    <Image src={item.imgUrl} alt="Product image" width={40} height={40} className="rounded-sm w-15 h-15 self-center max-[300px]:hidden"/>
                                    <div className="flex flex-col justify-between">
                                        <p className="text-sm">{item.name}</p>
                                        <p>Qtd: {item.amount}</p>
                                    </div>
                                </div>
                                <p className="self-center">R${item.price.toFixed(2).replace('.',',')}</p>
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    )
}