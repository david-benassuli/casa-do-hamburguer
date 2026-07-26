import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useUser } from "@/hook/UseUser"
import { X } from "lucide-react"
import { useCart } from "@/hook/UseCart"
import { ProductCartType } from "@/context/CartContext"
import { TagType } from "./Menu"
import { ProductType } from "@/context/ProductsContext"

type CardProductProps = {
    id: number,
    name: string,
    desc: string,
    price: number,
    tag: TagType,
    imgUrl: string,
    setProducts: Dispatch<SetStateAction<ProductType[]>>
}

export function CardProduct(props: CardProductProps) {

    const {user} = useUser()

    const {cart, setCart} = useCart()

    const [openModal, setOpenModal] = useState<boolean>(false)

    async function handleDisableProduct() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${props.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    active: false
                })
            })
            if (response.ok) {
                props.setProducts(prev => prev.filter(product => product.id !== props.id))
                alert('Produto desativado')
            }
        } catch(error) {
            console.log(error)
        }
        setOpenModal(false)
    }

    return (
        <div className="flex flex-row gap-2 max-md:flex-wrap">
            <Image src={props.imgUrl} alt="Menu Item"  width={180} height={180} className="rounded-sm"/>
            <div className="flex flex-col justify-between w-full gap-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-text-main text-2xl">{props.name}</h2>    
                    <p className="text-text-low text-xl">{props.desc}</p>
                </div>

                <div className={`flex flex-row justify-between w-full text-md items-center flex-wrap-reverse gap-2 ${!user?.admin && 'justify-end'}`}>
                    {user?.admin && <button type="button" className="p-1 border border-my-red text-my-red uppercase rounded-md hover:cursor-pointer hover:text-my-red/60 hover:border-my-red/60 transition-colors duration-200"
                        onClick={() => {
                            setOpenModal(true)
                        }}
                    >DESATIVAR</button>}
                    <div className="flex text-md gap-2">
                        <p className="text-secondary font-bold">R${props.price.toFixed(2).replace('.', ',')}</p>
                        <ShoppingCart className="w-5 h-5 text-text-main hover:cursor-pointer hover:text-text-low transition-colors duration-100"
                            onClick={() => {
                                const newItem: ProductCartType = {
                                    idCartItem: crypto.randomUUID(),
                                    idProduct: props.id,
                                    name: props.name,
                                    price: props.price,
                                    amount: 1,
                                    tag: props.tag,
                                    imgUrl: props.imgUrl
                                }
                                if (!cart.filter(item => item.idProduct === newItem.idProduct).length)
                                    setCart(prev => [...prev, newItem])
                                else {
                                    setCart(prev => prev.map(item => item.idProduct === newItem.idProduct ? {...item, amount: item.amount + 1} : item))
                                }
                            }}
                        />
                    </div>
                </div>

                {openModal && 
                <div className="bg-black/50 fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
                    <div className="flex flex-col p-5 gap-10 rounded-sm bg-bg-main">
                        <div className="flex flex-row justify-between items-center gap-10">
                            <h2 className="font-bold text-2xl text-text-main">Desativar o produto?</h2>
                            <X className="self-end text-text-low hover:cursor-pointer -translate-y-1" onClick={() => setOpenModal(false)}/>
                        </div>
                        <div className="flex self-center gap-5">
                            <button className="p-2 text-2xl rounded-sm border border-text-main text-text-main hover:cursor-pointer" onClick={() => setOpenModal(false)}>Cancelar</button>
                            <button className="p-2 text-2xl rounded-sm bg-my-red text-text-main hover:cursor-pointer" onClick={handleDisableProduct}>Desativar</button>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}