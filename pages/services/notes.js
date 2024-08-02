
"use client";
import React from "react";
import NavComp from '../../components/NavComp';
import dynamic from 'next/dynamic';
import { useSession } from "next-auth/react";
import NotesHistory from "../../components/NotesHistory";
import LoadingComp from '../../components/LoadingComp'

const CustomEditor = dynamic( () => import( '../../components/custom-editor' ), { ssr: false } );

export default function Notes() {
  const { data: session, status } = useSession();
  if (!session) {
    return (<div> <NavComp></NavComp>
    <div style={{display:"flex", justifyContent:"center", marginTop:"6vh"}}>
    <p>Please sign in to view your tasks.</p></div>
    </div>);
  }
  if (status === "loading") {
    return <LoadingComp></LoadingComp>;
  }
  return (
    <div>
        <NavComp></NavComp>
        
        <main className="w-[60vw] min-h-[50vh]" style={{position:"absolute", marginLeft:"30vw"}}>
        <CustomEditor></CustomEditor>
        </main>
        <aside className="w-[20vw] max-h-[87vh] overflow-y-scroll overflow-x-hidden ml-[6vw]">
          <NotesHistory></NotesHistory>
        </aside>
    </div>
  );
}
