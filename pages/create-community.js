import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CreateCommunity = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [approvalType, setApprovalType] = useState('automatic'); // New field
  const [password, setPassword] = useState(''); // Password state
  const { data: session, status } = useSession();
  
  if (!session) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "6vh" }}>
          <p>Please sign in to view your tasks.</p>
        </div>
      </div>
    );
  }

  const handleCreateCommunity = async () => {
    const passwordRegex = /^[A-Za-z0-9]{6,}$/; // At least 6 letters, no spaces
    if (approvalType === 'password' && !passwordRegex.test(password)) {
      alert('Password must be at least 6 letters/numbers long and contain no spaces.');
      return;
    }

    try {
      const email = session.user.email;
      const response = await axios.post('/api/communities', {
        name,
        description,
        approvalType,
        password: approvalType === 'password' ? password : null , // Include password if approvalType is password
        email,
      });
      alert('Community created successfully!');
      router.push('/User_Profile');
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Error creating community.');
    }
  };

  return (
    <div className="container mx-auto max-w-lg mt-12 p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create a New Community</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Community Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the community name"
            />
          </label>
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the community"
              rows="4"
            />
          </label>
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Approval Type:
            <select
              value={approvalType}
              onChange={(e) => setApprovalType(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="password">Password</option>
            </select>
          </label>
        </div>

        {approvalType === 'password' && (
          <div>
            <label className="block text-lg font-semibold text-gray-700">
              Community Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a password for community access"
              />
            </label>
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleCreateCommunity}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Community
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
