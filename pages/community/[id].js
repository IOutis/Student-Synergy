import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Community() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [access, setAccess] = useState(false);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && session) {
      const fetchCommunityData = async () => {
        try {
          const response = await axios.get(`/api/communities/${id}`);
          setCommunity(response.data);

          // Fetch posts by IDs
          if (response.data.posts.length > 0) {
            const postsResponse = await axios.get(`/api/communities/get_comm_posts`, {
              params: { ids: response.data.posts.join(',') },
            });
            setPosts(postsResponse.data);
          }

          // Check if the logged-in user is the admin
          if (response.data.adminEmail === session.user.email) {
            setAccess(true);
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
    <div>
      <h1>{community?.name}</h1>
      <p>{community?.description}</p>

      {access && (
        <div>
          <h2>Admin Controls</h2>
          <button>Edit Community</button>
          <a href={`/community/post/${id}`}>Create Post</a>
        </div>
      )}
      <div>
        <h2>Community Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
                <Link href={`/post/${post._id}`}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Posted by: {post.user}</p></Link>
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
}
