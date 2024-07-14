import Image from "next/image";
import { Inter } from "next/font/google";
import NavComp from './components/NavComp';
import UserLogin from './user_login'


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <NavComp></NavComp>
      
    </main>
  );
}
