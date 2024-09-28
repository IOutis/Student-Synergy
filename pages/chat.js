import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Gemini from '../components/Gemini'
import NavComp from '../components/NavComp'
export default function chat() {
  return (
    <div>
        <NavComp></NavComp>
      <Gemini></Gemini>
    </div>
  )
}
