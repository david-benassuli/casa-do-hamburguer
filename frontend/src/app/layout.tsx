import type { Metadata } from "next";
import { Sen } from 'next/font/google'
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";

export const sen = Sen({
  variable: "--font-Sen"
})

export const metadata: Metadata = {
  title: "Casa do Hambúrguer",
  description: "Criado por Felipe David",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="pt-br">

      <UserProvider>
        <ProductsProvider>
          <CartProvider>
            <body className="bg-bg-main font-Sen h-screen px-16 py-4 max-md:p-4 flex justify-center">
              {children}
            </body>
          </CartProvider>
        </ProductsProvider>
      </UserProvider>

    </html>
  );
}
