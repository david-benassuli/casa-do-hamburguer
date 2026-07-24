import { Header } from "@/components/Header/Header";
import { Menu } from "@/components/Menu/Menu";

export default function Home() {
  return (
    <section className="flex flex-col gap-5">
      <Header/>
      <Menu/>
    </section>
  );  
}
