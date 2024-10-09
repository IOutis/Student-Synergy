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
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Join Requests for {community?.name}</h1>

      {joinRequests.length > 0 ? (
        <ul className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
          {joinRequests.map((email) => (
            <li key={email} className="flex justify-between items-center border-b pb-3">
              <div className="text-lg text-gray-800">{email}</div>
              <button
                onClick={() => handleApprove(email)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 text-lg">No join requests at this time.</p>
        </div>
      )}
    </div>
  );
};

export default JoinRequests;
