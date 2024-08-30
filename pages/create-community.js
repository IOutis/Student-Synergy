import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import NavComp from '../components/NavComp';
import { useRouter } from 'next/router';
const CreateCommunity = () => {
  const router = useRouter()
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [approvalType, setApprovalType] = useState('automatic'); // New field
  const { data: session, status } = useSession();
  if (!session) {
    return (<div> <NavComp></NavComp>
    <div style={{display:"flex", justifyContent:"center", marginTop:"6vh"}}>
    <p>Please sign in to view your tasks.</p></div>
    </div>);
  }
  const handleCreateCommunity = async () => {
    try {
      const email = session.user.email
      const response = await axios.post('/api/communities', {
        name,
        description,
        approvalType,
        email
      });
      alert('Community created successfully!');
      router.push('/User_Profile');
      // Redirect or handle success
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
            </select>
          </label>
        </div>
        <button type="button" onClick={handleCreateCommunity}>
          Create Community
        </button>
      </form>
    </div>
  );
};

export default CreateCommunity;
