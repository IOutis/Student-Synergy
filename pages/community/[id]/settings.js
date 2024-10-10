import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CommunitySettings = () => {
  const router = useRouter();
  const {id} = router.query
  const { data: session, status } = useSession();
  const [community, setCommunity] = useState(null);
  const [name, setName] = useState('');
  const [approvalType, setApprovalType] = useState('automatic');
  const [password, setPassword] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Fetch community details on load
    const fetchCommunityDetails = async () => {
      try {
        const response = await axios.get(`/api/communities/${id}`);
        const data = response.data;
        setCommunity(data);
        setName(data.name);
        setApprovalType(data.approvalType);
        setMembers(data.members || []);
      } catch (error) {
        console.error('Error fetching community details:', error);
      }
    };

    fetchCommunityDetails();
  }, [id]);

  const handleRenameCommunity = async () => {
    try {
      await axios.put(`/api/communities/${id}/rename`, { name });
      alert('Community renamed successfully!');
    } catch (error) {
      console.error('Error renaming community:', error);
      alert('Failed to rename community.');
    }
  };

  const handleChangeApprovalType = async () => {
    if (approvalType === 'password' && password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      await axios.put(`/api/communities/${id}/approvalType`, {
        approvalType,
        password: approvalType === 'password' ? password : null,
      });
      alert('Approval type updated successfully!');
    } catch (error) {
      console.error('Error updating approval type:', error);
      alert('Failed to update approval type.');
    }
  };

  const handleRemoveMember = async (memberEmail) => {
    try {
      await axios.put(`/api/communities/${id}/removeMember`, { memberEmail });
      setMembers(members.filter(member => member !== memberEmail));
      alert('Member removed successfully!');
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member.');
    }
  };

  if (!community) return <p>Loading...</p>;

  return (
    <div className="container mx-auto max-w-lg mt-12 p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Community Settings</h1>

      {/* Rename Community */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700">Rename Community</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter new community name"
        />
        <button
          onClick={handleRenameCommunity}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>

      {/* Change Approval Type */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700">Change Approval Type</label>
        <select
          value={approvalType}
          onChange={(e) => setApprovalType(e.target.value)}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
          <option value="password">Password</option>
        </select>

        {/* Password Input - Conditional */}
        {approvalType === 'password' && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter new password"
          />
        )}
        <button
          onClick={handleChangeApprovalType}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>

      {/* Remove Members */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Remove Members</h2>
        <ul className="mt-2 space-y-2">
          {members.map((member, index) => (
            <li key={index} className="flex justify-between items-center border-b py-2">
              <span>{member}</span>
              <button
                onClick={() => handleRemoveMember(member)}
                className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommunitySettings;
