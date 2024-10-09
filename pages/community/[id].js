import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Community() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [useraccess, setUseraccess] = useState(false);
  const [adminaccess, setAdminaccess] = useState(false);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("Successfully joined the community!");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(""); // Add password state
  const [showPasswordField, setShowPasswordField] = useState(false); // To control password input visibility

  useEffect(() => {
    if (id && session) {
      const fetchCommunityData = async () => {
        try {
          const response = await axios.get(`/api/communities/${id}`);
          setCommunity(response.data);
          console.log("Members : ",response.data.members)
  
          if (response.data.posts.length > 0) {
            const postsResponse = await axios.get(`/api/communities/get_comm_posts`, {
              params: { ids: response.data.posts.join(',') },
            });
            setPosts(postsResponse.data);
          }
  
          if (response.data.adminEmail === session.user.email) {
            setAdminaccess(true);
            setUseraccess(true);
          }
          if(response.data.approvalType === "manual"){
            setMsg("Your request to join the community has been sent to the admin for approval.");
          }
          if (response.data.approvalType === "password") {
            setShowPasswordField(true); // Show password field if approval type is password
          }
  
          // Ensure community is not null before accessing properties
          if (response.data && response.data.members) {
            if (response.data.members.includes(session.user.email)) {
              setUseraccess(true);
            }
          }
        } catch (error) {
          console.error('Error fetching community data', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCommunityData();
    } else if (!session) {
      setLoading(false);
    }
  }, [id, session]);
  
  const handleJoinCommunity = async () => {
    console.log("sending request...");
    
    try {
      // Construct query string parameters
      const response = await axios.get('/api/communities/join', {
        params: {
          communityId: id,
          userEmail: session.user.email,
          password: showPasswordField ? password : undefined, // Add password query only if it's required
        }
      });
      
      // Success logic
      const successMsg = community.approvalType === "manual"
        ? 'Your request to join the community has been sent to the admin for approval.'
        : 'Successfully joined the community!';
  
      alert(successMsg);
    } catch (err) {
      console.error('Error joining community', err);
      alert('Failed to join community. Try again after sometime');
    }
    window.location.reload(); 
  };

  if (!session) {
    return (
      <div>
        <p>Not Logged in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {community ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{community.name}</h1>
          <p className="text-lg text-gray-600 mb-6">{community.description}</p>

          {adminaccess && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Admin Controls</h2>
              <p className="text-gray-600 mb-2">Requests: {community.joinRequests.length}</p>
              <p className="text-gray-600 mb-4">Members joined: {community.members.length}</p>
              <Link href={`/community/${id}/requests`}>
                <button className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition">
                  View Join Requests
                </button>
              </Link>
                <Link href={`/community/${id}/settings`}>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition mr-4">
                  Settings
                </button>
                </Link>
              <Link href={`/community/post/${id}`}>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                  Create Post
                </button>
              </Link>
            </div>
          )}

          {useraccess && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Community Posts</h2>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="mb-4 p-4 bg-gray-100 rounded-md shadow">
                    <Link href={`/post/${post._id}`}>
                      <button className="text-xl font-bold text-blue-700 hover:underline">{post.title}</button>
                    <p className="text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: post.content }}></p>
                    <p className="text-gray-500 text-sm mt-2">Posted by: {post.user}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No posts yet</p>
              )}
            </div>
          )}

          {!useraccess && (
            <div className="mt-6">
              <p className="text-red-500 text-lg mb-4">You are not authorized to view this community&apos;s content.</p>
              {showPasswordField && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Enter Community Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Password"
                  />
                </div>
              )}
              <button
                onClick={handleJoinCommunity}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Join Community
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-xl">Community not found or error loading data.</p>
        </div>
      )}
    </div>
  );
}
