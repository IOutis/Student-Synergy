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
    <div>
      <h1>Create a New Community</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>
            Community Name:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </label>
        </div>
        <div>
          <label>
            Approval Type:
            <select 
              value={approvalType} 
              onChange={(e) => setApprovalType(e.target.value)} 
              required
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="password">Password</option>
            </select>
          </label>
        </div>

        {/* Password Field - only visible when approvalType is "password" */}
        {approvalType === 'password' && (
          <div>
            <label>
              Community Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
        )}

        <button type="button" onClick={handleCreateCommunity}>
          Create Community
        </button>
      </form>
    </div>
  );
};

export default CreateCommunity;
