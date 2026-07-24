'use client'

import { useEffect, useState } from "react";
import { ButtonFilter } from "../ButtonFilter";
import { CardOrders } from "./CardOrders";
import { UserType } from "@/context/UserContext";
import { ProductCartType } from "@/context/CartContext";

export type StatusOrderType = 'pending' | 'delivered' | 'canceled'

export type OrderType = {
    id: string,
    user: UserType,
    orderTime: Date,
    deliveredTime?: Date,
    items: ProductCartType[],
    status: StatusOrderType,
    total: number
}

export function OrdersMenu() {

    const [filterOrders, setFilterOrders] = useState<string>('')
    const [orders, setOrders] = useState<OrderType[]>([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`)
                const data = await response.json()
                setOrders(data)
            } catch(error) {
                console.log(error)
            }
        }
        fetchOrders()
    }, [])

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-2 max-sm:flex-col">
                <ButtonFilter type="pending" filter={filterOrders} setFilter={setFilterOrders}>Pendentes</ButtonFilter>
                <ButtonFilter type="delivered" filter={filterOrders} setFilter={setFilterOrders}>Entregues</ButtonFilter>
                <ButtonFilter type="canceled" filter={filterOrders} setFilter={setFilterOrders}>Cancelados</ButtonFilter>
            </div>
            {orders.length > 0 ? <div className="flex flex-row flex-wrap gap-5">
                {orders.filter(order => (order.status === filterOrders || !filterOrders)).map((order, index) => 
                <CardOrders setOrders={setOrders}
                    key={order.id}
                    id={index+1}
                    orderId={order.id}
                    name={order.user.name}
                    orderTime={order.orderTime}
                    deliveredTime={order.deliveredTime}
                    status={order.status}
                    total={order.total}
                    items={order.items}
                />)}
            </div> : <p className="text-text-main text-2xl font-bold">Ainda não há pedidos</p>}
        </div>
    )
}