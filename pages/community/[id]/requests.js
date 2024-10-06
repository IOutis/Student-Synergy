// pages/community/[id]/requests.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const JoinRequests = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: communityId } = router.query;

  const [joinRequests, setJoinRequests] = useState([]);
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    if (!communityId) return;

    // Fetch community join requests
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get(`/api/communities/${communityId}`);
        setCommunity(response.data);
        setJoinRequests(response.data.joinRequests);
      } catch (error) {
        console.error('Error fetching community data', error);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  const handleApprove = async (email) => {
    const confirmed = window.confirm(`Are you sure you want to approve ${email}?`);

    if (!confirmed) return;

    try {
      await axios.post(`/api/communities/approve`, { communityId, userEmail: email });
      alert('User approved successfully!');
      setJoinRequests(joinRequests.filter(request => request !== email));
    } catch (error) {
      console.error('Error approving user', error);
      alert('Error approving user');
    }
  };

  const isAdmin = session?.user?.email === community?.adminEmail;

  if (!isAdmin) {
    return <p>You do not have access to this page.</p>;
  }

  return (
    <div>
      <h1>Join Requests for {community?.name}</h1>
      {joinRequests.length > 0 ? (
        <ul>
          {joinRequests.map((email) => (
            <li key={email}>
              {email}
              <button onClick={() => handleApprove(email)}>Approve</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No join requests at this time.</p>
      )}
    </div>
  );
};

export default JoinRequests;
