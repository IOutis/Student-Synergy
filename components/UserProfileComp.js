import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const UserProfile = ({ email }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [communitiesCreated, setCommunitiesCreated] = useState([]);
  const [communitiesJoined, setCommunitiesJoined] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user_data?email=${email}`); // Fetch the user profile
        setUser(response.data.user);
        setCommunitiesCreated(response.data.communitiesCreated);
        setCommunitiesJoined(response.data.communitiesJoined);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    fetchUserData();
  }, [email]);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/users/search?query=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users', error);
      setSearchResults([]);
    }
  };

  // const handleJoinCommunity = async (communityId) => {
  //   try {
  //     await axios.post(`/api/communities/join`, { communityId, userEmail: session.user.email });
  //     // Optionally, update UI or refetch user data to reflect the joined community
  //     alert('Successfully joined the community!');
  //   } catch (error) {
  //     console.error('Error joining community', error);
  //   }
  // };
  const handleDelete = async (id)=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this Community?");
  if (confirmDelete) {
    try{
    axios.delete(`api/communities/delete_community?id=${id}`,{
      method:"DELETE"
    })
    alert('Successfully Deleted the community!');
    window.location.reload()
  } catch (error) {
    console.error('Error deleting community', error);
  }
}


  }

  const isCurrentUser = session?.user?.email === email;

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="col-span-1 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{user?.name}&apos;s Profile</h1>
          <div className="space-y-2">
            <p><strong>Level:</strong> {user?.level}</p>
            <p><strong>Experience:</strong> {user?.experience}</p>
            <p><strong>Coins:</strong> {user?.coins}</p>
          </div>
        </div>

        {/* Communities */}
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          {isCurrentUser ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Communities Created</h2>
              <ul className="list-disc list-inside mb-6">
                {communitiesCreated.map((community) => (
                  <li key={community._id} className="mb-2">
                    <a href={`/community/${community._id}`} className="text-blue-600 hover:underline">
                      {community.name}
                    </a>
                    <button className='ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition' onClick={()=>handleDelete(community._id)}>Delete Community</button>
                  </li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">Communities Joined</h2>
              <ul className="list-disc list-inside mb-6">
                {communitiesJoined.map((community) => (
                  <li key={community._id} className="mb-2">
                    <a href={`/community/${community._id}`} className="text-blue-600 hover:underline">
                      {community.name}
                    </a>
                  </li>
                ))}
              </ul>

              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => window.location.href = '/create-community'}
              >
                Create New Community
              </button>
            </>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{user?.name}&apos;s Communities</h2>
              <ul className="list-disc list-inside mb-6">
                {communitiesCreated.map((community) => (
                  <li key={community._id} className="mb-2 flex items-center justify-between">
                    <a href={`/community/${community._id}`} className="text-blue-600 hover:underline">
                      {community.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Users</h2>
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full border-2 border-gray-300 p-2 rounded-md mb-4"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <ul className="list-disc list-inside">
          {searchResults.map((result) => (
            <li key={result._id} className="mb-2">
              <a href={`/user/${result.email}`} className="text-blue-600 hover:underline">
                {result.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;
