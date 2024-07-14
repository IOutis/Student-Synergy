import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginPage() {
  return (
    <div>
      <button onClick={() => signIn('google')}>Sign in</button>
      
    </div>
  )
}
