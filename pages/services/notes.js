
"use client";
import React from "react";
import NavComp from '../../components/NavComp';
import dynamic from 'next/dynamic';
import { useSession } from "next-auth/react";
import NotesHistory from "../../components/NotesHistory";

const CustomEditor = dynamic( () => import( '../../components/custom-editor' ), { ssr: false } );

export default function Notes() {
  const { data: session, status } = useSession();
  if (!session) {
    return <p>Please sign in to view your tasks.</p>;
  }
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <div>
        <NavComp></NavComp>
        
        <main className="w-[60vw] min-h-[50vh]" style={{position:"absolute", marginLeft:"30vw"}}>
        <CustomEditor></CustomEditor>
        </main>
        <aside className="w-[20vw] max-h-[70vh] overflow-y-scroll overflow-x-hidden ml-[6vw]">
          <NotesHistory></NotesHistory>
        </aside>
    </div>
  );
}
