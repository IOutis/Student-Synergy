import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import {
  Box, Button, FormControl, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, Textarea, Alert, AlertIcon
} from '@chakra-ui/react';

export default function Community() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [useraccess, setUseraccess] = useState(false);
  const [adminaccess, setAdminaccess] = useState(false);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("Successfully joined the community!");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(""); 
  const [showPasswordField, setShowPasswordField] = useState(false); 
  const [sectionTitle, setSectionTitle] = useState(""); 
  const [sectionDescription, setSectionDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [sections, setSections] = useState([]);
  const [qaSectionExists,setQaSectionExists] = useState(false);
  useEffect(() => {
    if (id && session) {
      const fetchCommunityData = async () => {
        try {
          const response = await axios.get(`/api/communities/${id}`);
          setCommunity(response.data);
          
          if (response.data.sections?.length > 0) {
            const sectionResponse = await axios.get(`/api/communities/${response.data._id}/sections`, {
              params: { id: response.data._id },
            });
            const sectionsData = sectionResponse.data.sections
            setSections(sectionResponse.data.sections);

            const qaSection = sectionsData.find(section => section.title === "Q&A Section");
            if (qaSection) setQaSectionExists(true);
          }

          if (response.data.adminEmail === session.user.email) {
            setAdminaccess(true);
            setUseraccess(true);
          }
          if(response.data.approvalType === "manual"){
            setMsg("Your request to join the community has been sent to the admin for approval.");
          }
          if (response.data.approvalType === "password") {
            setShowPasswordField(true);
          }
  
          if (response.data && response.data.members) {
            if (response.data.members.includes(session.user.email)) {
              setUseraccess(true);
            }
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

  useEffect(() => {
    const fetchSectionPosts = async () => {
      if (sections.length > 0) {
        try {
          const updatedSections = await Promise.all(
            sections.map(async (section) => {
              if (section.posts.length > 0) {
                const postResponse = await axios.get(`/api/communities/${community._id}/section/${section._id}`);
                return {
                  ...section,
                  posts: postResponse.data.sections,  
                };
              } else {
                return section;
              }
            })
          );
          setSections(updatedSections);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };
  
    fetchSectionPosts();
  }, [sections]);

  // Helper function to truncate HTML content safely
  const truncateHTMLContent = (htmlContent, maxLength) => {
    const plainText = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: [] }); // Strips HTML tags
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };
  const handleAddQASection = async () => {
    // Handle adding the Q&A Section with a fixed title and description
    try {
      const response = await axios.post(`/api/communities/${id}/sections`, {
        title: "Q&A Section",
        description: "Post your queries and doubts here. Community members will respond.",
        qaSection: true
      });
      //qaSection: { type: Boolean, default: false },
      alert("Q&A Section added successfully!");
      setQaSectionExists(true);
      window.location.reload()
    } catch (error) {
      console.error('Error adding Q&A section', error);
      alert('Failed to add Q&A Section. Try again later.');
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const response = await axios.get('/api/communities/join', {
        params: {
          communityId: id,
          userEmail: session.user.email,
          password: showPasswordField ? password : undefined,
        }
      });
      
      const successMsg = community.approvalType === "manual"
        ? 'Your request to join the community has been sent to the admin for approval.'
        : 'Successfully joined the community!';
  
      alert(successMsg);
    } catch (err) {
      console.error('Error joining community', err);
      alert('Failed to join community. Try again after sometime');
    }
    window.location.reload(); 
  };

  const handleAddSection = async () => {
    if (!sectionTitle || !sectionDescription) {
      setAlertMessage("Please fill in both the title and description.");
      return;
    }

    try {
      const response = await axios.post(`/api/communities/${id}/sections`, {
        title: sectionTitle,
        description: sectionDescription,
      });
      alert("Section added successfully!");
      onClose();
      setSectionTitle(""); 
      setSectionDescription(""); 
      window.location.reload()
      
    } catch (error) {
      console.error('Error adding section', error);
      alert('Failed to add section. Try again after sometime.');
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        try {
            const res = await fetch(`/api/comm_post/delete_post?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete the post');
            }

            setPosts(posts.filter(post => post._id !== id));
            alert('Post deleted successfully');
            window.location.reload()
        } catch (error) {
            console.error('Error deleting post:', error.message);
            alert('Failed to delete the post. Please try again later.');
        }
    }
};
const handleDeleteSection = async (id)=>{
  
  const confirmDelete = window.confirm("Are you sure you want to delete this section?");
  if (confirmDelete) {
    try {
      const response = await axios.delete(`/api/communities/section_delete?id=${id}`,{
        method:"DELETE",
      })
      console.log("response : ",response)

      if(response.statusText!="OK"){
        throw new Error('Failed to delete the section');
      }
      alert('Section Deleted successfully')
      window.location.reload()
    }
    catch(error){
      console.error('Error deleting section:', error.message);
      alert('Failed to delete the section. Please try again later.');
    }
      }
    }

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
    <div className="container mx-auto p-6">
      {community ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{community.name}</h1>
          <p className="text-lg text-gray-600 mb-6">{community.description}</p>

          {adminaccess && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Admin Controls</h2>
              <p className="text-gray-600 mb-2">Requests: {community.joinRequests.length}</p>
              <p className="text-gray-600 mb-4">Members joined: {community.members.length}</p>
              <Link href={`/community/${id}/requests`}>
                <button className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition">
                  View Join Requests
                </button>
              </Link>
              <Link href={`/community/${id}/settings`}>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition mr-4">
                  Settings
                </button>
              </Link>
              <Button colorScheme="teal" onClick={onOpen} mt={4}>
                Add Section
              </Button>
              {!qaSectionExists && (
                <Button
                  colorScheme="orange"
                  mt={4}
                  onClick={handleAddQASection}
                >
                  Add Q&A Section
                </Button>
              )}
            </div>
          )}

          {useraccess && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sections</h2>
              {community.sections && community.sections.length > 0 ? (
                sections.map((section) => (
                  <div key={section._id} className="mb-6 p-4 bg-gray-100 rounded-md shadow">
                    <h3 className="text-xl font-bold text-blue-700">{section.title}</h3>
                    {adminaccess&&<button className='ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition' onClick={()=>handleDeleteSection(section._id)}>Delete Section</button>}
                    <p className="text-gray-600">{section.description}</p>
                    
                    <div className="mt-4">
                      {section.posts && section.posts.length > 0 ? (
                        <div>
                          <h4 className="font-semibold">Posts:</h4>
                          <ul className="list-disc pl-5">
                            {section.posts.map((post) => (
                              <li key={post._id} className="text-gray-700">
                                <Link href={`/post/${post._id}`}>
                                  <p className="text-blue-600 hover:underline">{post.title}</p>
                                </Link>
                                <p 
                                  dangerouslySetInnerHTML={{
                                    __html: truncateHTMLContent(post.content, 70) // Truncated HTML content
                                  }}
                                />
                                {((post.user===session.user.name)||adminaccess)&& <button
                                  className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                                  onClick={() => handleDelete(post._id)}
                                >
                                  Delete
                                </button>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>No posts available in this section.</p>
                      )}
                    </div>
                
                    {(section.qaSection||adminaccess) && <Link href={`/community/${id}/section/${section._id}`}>
                      <Button colorScheme="green" className="mt-2">Create Post in this Section</Button>
                    </Link>}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No sections available. Please ask an admin to add one.</p>
              )}
            </div>
          )}

          {!useraccess && (
            <div className="mt-6">
              <p className="text-red-500 text-lg mb-4">You are not authorized to view this community&apos;s content.</p>
              {showPasswordField && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Enter Community Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Password"
                  />
                </div>
              )}
              <button
                onClick={handleJoinCommunity}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Join Community
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 text-xl">Community not found or error loading data.</p>
        </div>
      )}
      {/* Modal for Adding Section */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {alertMessage && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {alertMessage}
              </Alert>
            )}
            <FormControl>
              <FormLabel>Section Title</FormLabel>
              <Input
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Enter section title"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Section Description</FormLabel>
              <Textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                placeholder="Enter section description"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddSection}>
              Add Section
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
