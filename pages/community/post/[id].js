import React from 'react'
import dynamic from 'next/dynamic';
const CustomEditor = dynamic( () => import( '../../../components/Post' ), { ssr: false } );
import { useRouter } from 'next/router';
export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <CustomEditor private={true} id={id}></CustomEditor> 
    </div>
  )
}
