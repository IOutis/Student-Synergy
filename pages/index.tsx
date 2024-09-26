import Image from "next/image";
import { Inter } from "next/font/google";
import NavComp from '../components/NavComp';
import UserLogin from './user_login'


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex  flex-col    ${inter.className}`}
    >
      <NavComp></NavComp>
      <h3 className="flex justify-center items-center">Still under development. Stay tuned</h3>
      <div style={{display:"flex", flexDirection:"column", width:"30%", marginLeft:"auto", marginRight:"auto", marginTop:"5%", }}>
      <h3>Student Synergy isn't some magic fix or shortcut—it's a tool meant to be used wisely. Just like pencils were made for writing, but even someone like John Wick, known as Baba Yaga, turned one into a deadly weapon, it shows that tools can be used for very different things depending on how we choose to use them.</h3>
      </div>
    </main>
  );
}
