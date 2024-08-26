import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({email}) => {
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
        console.log(response);
        setCommunitiesCreated(response.data.communitiesCreated);
        setCommunitiesJoined(response.data.communitiesJoined);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/users/search?query=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users', error);
    }
  };

  const handleApproveRequest = async (communityId, email) => {
    try {
      await axios.post(`/api/communities/${communityId}/approve`, { email });
      // Update the community or refetch data
    } catch (error) {
      console.error('Error approving request', error);
    }
  };

  return (
    <div>
      <h1>{user?.name}'s Profile</h1>
      <p>Level: {user?.level}</p>
      <p>Experience: {user?.experience}</p>
      <p>Coins: {user?.coins}</p>

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

      <h2>Join a Community</h2>
      <button onClick={() => window.location.href = '/join-community'}>
        Join Community
      </button>

      <h2>Search Users</h2>
      <input type="text" placeholder="Search by name or email" onChange={(e) => handleSearch(e.target.value)} />
      <ul>
        {searchResults.map((result) => (
          <li key={result._id}>
            <a href={`/user/${result._id}`}>{result.email}</a>
            <button onClick={() => window.location.href = `/user/${result._id}/join-community`}>
              Join User's Community
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
