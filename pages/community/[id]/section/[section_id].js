import React from 'react'
import dynamic from 'next/dynamic';
import Link from 'next/link';
const CustomEditor = dynamic( () => import( '../../../../components/Post' ), { ssr: false } );
import { useRouter } from 'next/router';
export default function Post() {
  const router = useRouter();
  const { section_id } = router.query;
  // const { id } = router.query;
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Create or Edit Post</h1>
          {/* <Link href={`/community/${id}`}>
            <button className="text-blue-600 hover:text-blue-800 text-lg">Back to Community</button>
          </Link> */}
        </div>
      </div>

      <div className="flex-grow container mx-auto p-4">
        <div className="bg-white shadow-md rounded-md p-6 max-w-4xl mx-auto">
          <CustomEditor private={true} id={section_id} />
        </div>
      </div>
    </div>
  )
}
