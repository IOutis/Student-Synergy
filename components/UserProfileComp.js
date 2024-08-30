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

  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(`/api/communities/join`, { communityId, userEmail: session.user.email });
      // Optionally, update UI or refetch user data to reflect the joined community
      alert('Successfully joined the community!');
    } catch (error) {
      console.error('Error joining community', error);
    }
  };

  const isCurrentUser = session?.user?.email === email;

  return (
    <div>
      <h1>{user?.name}'s Profile</h1>
          <p>Level: {user?.level}</p>
          <p>Experience: {user?.experience}</p>
          <p>Coins: {user?.coins}</p>

      {isCurrentUser ? (
        <>
          <h2>Communities Created</h2>
          <ul>
            {communitiesCreated.map((community) => (
              <li key={community._id}>
                <a href={`/community/${community._id}`}>{community.name}</a>
                <br />
                <a href={`/community/${community._id}/requests`}>View Join Requests</a>
              </li>
            ))}
          </ul>

          <h2>Communities Joined</h2>
          <ul>
            {communitiesJoined.map((community) => (
              <li key={community._id}>
                <a href={`/community/${community._id}`}>{community.name}</a>
              </li>
            ))}
          </ul>

          <h2>Create a New Community</h2>
          <button onClick={() => window.location.href = '/create-community'}>
            Create Community
          </button>
        </>
      ) : (
        <div>
          <h2>{user?.name}s Communities</h2>
          <ul>
            {communitiesCreated.map((community) => (
              <li key={community._id}>
                <a href={`/community/${community._id}`}>{community.name}</a>
                <button onClick={() => handleJoinCommunity(community._id)}>
                  Join Community
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2>Communities Joined</h2>
          <ul>
            {communitiesJoined.map((community) => (
              <li key={community._id}>
                <a href={`/community/${community._id}`}>{community.name}</a>
              </li>
            ))}
          </ul>

      <h2>Search Users</h2>
      <input type="text" placeholder="Search by name or email" onChange={(e) => handleSearch(e.target.value)} />
      <ul>
        {searchResults.map((result) => (
          <li key={result._id}>
            <a href={`/user/${result.email}`}>{result.name}</a>
            <button onClick={() => window.location.href = `/user/${result._id}/join-community`}>
              Join Users Community
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
