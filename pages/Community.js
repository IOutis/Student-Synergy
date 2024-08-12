import React from 'react'
import dynamic from 'next/dynamic';
import { useSession } from "next-auth/react";
import NavComp from '../components/NavComp';
import LoadingComp from '../components/LoadingComp';
// import CustomEditor from '../components/Post';
const CustomEditor = dynamic( () => import( '../components/Post' ), { ssr: false } );


export default function Community() {
    const { data: session,status } = useSession()
    if(status=="unauthenticated"){
        return (<div><NavComp></NavComp><p>Please sign in</p></div>);
    }
    if(status=="loading"){
        return <LoadingComp></LoadingComp>
    }
  return (
    <div>
      <NavComp></NavComp>
      <main className="w-[60vw] min-h-[50vh]" style={{position:"absolute", marginLeft:"30vw"}}>
        <CustomEditor></CustomEditor>
        </main>
        <aside className="w-[20vw] max-h-[87vh] overflow-y-scroll overflow-x-hidden ml-[6vw]">
          
        </aside>

    </div>
  )
}
