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
            setAdminaccess(true);
          }
          console.log(community.approvalType)
          console.log(community.members)
          if(community.members.includes(session.user.email)){

            setUseraccess(true);
            console.log(useraccess)
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
    try {
      await axios.post(`/api/communities/join`, { communityId: id, userEmail: session.user.email });
      // Optionally, update UI or refetch user data to reflect the joined community
      if(community.approvalType == "manual"){
        alert("Your request to join the community has been sent to the admin for approval.")
      }
      else{
      alert('Successfully joined the community!');
      }
      window.location.reload()
    } catch (error) {
      console.error('Error joining community', error);
    }
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
    <div>
      <h1>{community?.name}</h1>
      <p>{community?.description}</p>
      {adminaccess && (<div>
        <a href={`/community/${id}/requests`}><h2>Requests Page</h2></a>
        <p>Requests : {community.joinRequests.length}</p>
        <p>Members joined : {community.members.length}</p>
      </div>)}
      <br />
      {adminaccess && (
        <div>
          <h2>Admin Controls</h2>
          <button>Edit Community</button>
          <a href={`/community/post/${id}`}>Create Post</a>
        </div>
      )}
      {useraccess &&
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
}
{!useraccess && <p>True</p>}
{(!useraccess) && (<div>
  <p>Not Authorized</p> 
  <button onClick={()=>{handleJoinCommunity()}}>Join Community</button>
  
</div>)}
    </div>
  );
}
