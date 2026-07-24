import type { TagType } from "./Menu"
import { CardProduct } from "./CardProduct"
import { Dispatch, SetStateAction } from "react"
import { ProductType } from "@/context/ProductsContext"

type CardMenuProps = {
    tag: TagType,
    filter: string,
    tagProducts: ProductType[] ,
    setProducts: Dispatch<SetStateAction<ProductType[]>>
}

export function CardMenu(props: CardMenuProps) {
    return (
        <div className={`${props.filter === props.tag || !props.filter ? 'flex flex-col gap-5' : 'hidden'}`}>
            <h2 className="uppercase text-secondary font-bold text-2xl">{props.tag + "S"}</h2>
            {props.tagProducts.map(product => <CardProduct id={product.id} key={product.id} name={product.name} desc={product.desc} price={product.price} tag={product.tag} imgUrl={product.imgUrl} setProducts={props.setProducts}/>)}
        </div>
    )
}