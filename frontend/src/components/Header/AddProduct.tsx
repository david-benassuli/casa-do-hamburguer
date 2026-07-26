'use client'

import { useProducts } from "@/hook/UseProducts"
import { X, ImagePlus } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

type AddProductProps = {
    setOpenAddProduct: Dispatch<SetStateAction<boolean>>
}

export function AddProduct({ setOpenAddProduct }: AddProductProps) {
    const [preview, setPreview] = useState<string | null>(null)

    const [inputName, setInputName] = useState("")
    const [inputDesc, setInputDesc] = useState("")
    const [inputTag, setInputTag] = useState("")
    const [inputPrice, setInputPrice] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {setProducts} = useProducts()

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (!file) return

        setPreview(URL.createObjectURL(file))
        if (e.target.files) {
            setImageFile(e.target.files[0])
        }
    }

    async function handleAddProduct() {
        try {
            if (!imageFile) {
                alert("Selecione uma imagem");
                return;
            }
            const formData = new FormData();
            formData.append("name", inputName.trim());
            formData.append("desc", inputDesc.trim());
            formData.append("tag", inputTag);
            formData.append("price", inputPrice);
            formData.append("image", imageFile);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: "POST",
                body: formData
            })
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setProducts(prev => [...prev, data]);
            setOpenAddProduct(false);
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div className="fixed inset-0 z-1 bg-black/50 flex items-center justify-center p-5">
            <div className="bg-[#24201A] max-w-200 grow rounded-sm p-6 flex flex-col gap-5 text-text-low">

                {/* Header */}
                <div className="flex justify-between items-center gap-5">
                    <h2 className="text-2xl text-text-low">
                        Adicionar produto
                    </h2>

                    <X
                        size={22}
                        className="text-text-low cursor-pointer hover:text-white transition"
                        onClick={() => setOpenAddProduct(false)}
                    />
                </div>

                <div className="flex flex-row flex-wrap justify-center items-center gap-5">

                    <div className="w-52 h-52 shrink-0">

                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImage}
                        />

                        <label
                            htmlFor="image"
                            className="w-full h-full border border-text-low rounded-md
                            flex items-center justify-center cursor-pointer
                            overflow-hidden hover:border-my-red transition"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImagePlus
                                    size={55}
                                    className="text-text-low"
                                />
                            )}
                        </label>

                    </div>

                    <div className="flex flex-col justify-between flex-1 gap-2">
                        <input className="p-3 border border-text-low rounded-md  text-text-low" type="text" placeholder="Nome do produto"
                            onChange={(e) => setInputName(e.target.value)}
                        />
                        <input className="p-3 border border-text-low rounded-md  text-text-low" type="text" placeholder="Descrição"
                            onChange={(e) => setInputDesc(e.target.value)}
                        />
                        <select className="p-3 border border-text-low rounded-md  text-text-low"
                            onChange={(e) => setInputTag(e.target.value)}
                        >
                            <option value="">Categoria</option>
                            <option value="burger">Hambúrguer</option>
                            <option value="drink">Bebida</option>
                            <option value="portion">Porção</option>
                        </select>
                        <input className="p-3 border border-text-low rounded-md  text-text-low" type="number" placeholder="Preço"
                            onChange={(e) => setInputPrice(e.target.value)}
                        />

                    </div>

                </div>

                <button className="bg-my-red text-white p-3 rounded-md hover:bg-my-red/60 transition cursor-pointer font-semibold" onClick={handleAddProduct}
                >Adicionar produto</button>

            </div>
        </div>
    )
}