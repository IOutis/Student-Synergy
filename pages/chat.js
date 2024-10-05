import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Gemini from '../components/Gemini'
export default function chat() {
  return (
    <div>
      <Gemini></Gemini>
    </div>
  )
}
