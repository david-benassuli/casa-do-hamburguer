'use client'

import {  useEffect, useState } from "react"
import { ButtonFilter } from "../ButtonFilter"
import { CardMenu } from "./CardMenu"
import { useProducts } from "@/hook/UseProducts"
import { ProductType } from "@/context/ProductsContext"

export type TagType = 'burger' | 'drink' | 'portion'

export function Menu() {

    const [filterProducts, setFilterProducts] = useState<string>("")
    const {products, setProducts} = useProducts()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
                const data: ProductType[] = await response.json()
                setProducts(data.filter(item => item.active === true))
            } catch(error) {
                console.error(error)
            }
        }
        fetchProducts()
    }, [])

    const burgers = products.filter(product => product.tag === 'burger')
    const drinks = products.filter(product => product.tag === 'drink')
    const portions = products.filter(product => product.tag === 'portion')

    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-row gap-2 max-sm:flex-col">
                <ButtonFilter type='burger' filter={filterProducts} setFilter={setFilterProducts}>Hamburguer</ButtonFilter>
                <ButtonFilter type='drink' filter={filterProducts} setFilter={setFilterProducts}>Bebidas</ButtonFilter>
                <ButtonFilter type='portion' filter={filterProducts} setFilter={setFilterProducts}>Porções</ButtonFilter>
            </div>
            {products.length > 0 ? <div className="flex flex-col gap-5">
                <CardMenu tag="burger" filter={filterProducts} tagProducts={burgers} setProducts={setProducts}/>
                <CardMenu tag="drink" filter={filterProducts} tagProducts={drinks} setProducts={setProducts}/>
                <CardMenu tag="portion" filter={filterProducts} tagProducts={portions} setProducts={setProducts}/>
            </div> : <p className="text-text-main text-2xl font-bold">Ainda não há produtos</p>}
        </section>
    )
}