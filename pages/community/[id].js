import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
            //console.log(sectionResponse.data.sections[0])
            setSections(sectionResponse.data.sections);
            //console.log("sections : ",sections)

            
          }

          console.log("Community : ",response.data.adminEmail === session.user.email)
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
              console.log(`Fetching posts for section: ${section.title}, ${section._id}`);
              
              if (section.posts.length > 0) {
                const postResponse = await axios.get(`/api/communities/${community._id}/section/${section._id}`);
                console.log(`Post data for section "${section.title}":`, postResponse.data.sections);
  
                // Return the section with its posts added
                return {
                  ...section,
                  posts: postResponse.data.sections,  // Update with the posts data
                };
              } else {
                console.log(`No posts in section "${section.title}"`);
                return section;  // No posts, return as is
              }
            })
          );
          // Update the sections state with the posts for each section
          setSections(updatedSections);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };
  
    fetchSectionPosts();
  }, [sections]);
  
  
  

  const handleJoinCommunity = async () => {
    console.log("sending request...");
    
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
      console.log(response)
      alert("Section added successfully!");
      onClose();
      setSectionTitle(""); 
      setSectionDescription(""); 
      // Reload community data to reflect the newly added section
      
    } catch (error) {
      console.error('Error adding section', error);
      alert('Failed to add section. Try again after sometime.');
    }
  };

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
            </div>
          )}

          {useraccess && (
            <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sections</h2>
            {community.sections && community.sections.length > 0 ? (
              sections.map((section) => (
                <div key={section._id} className="mb-6 p-4 bg-gray-100 rounded-md shadow">
                  <h3 className="text-xl font-bold text-blue-700">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                  <div className="mt-4">
                          {section.posts && section.posts.length > 0 ? (
                            <div>
                              <h4 className="font-semibold">Posts:</h4>
                              <ul className="list-disc pl-5">
                                {posts.map((post) => (
                                  <li key={post._id} className="text-gray-700">
                                    <Link href={`/post/${post._id}`}>
                                      <p className="text-blue-600 hover:underline">{post.title}</p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p>No posts available in this section.</p>
                          )}
                  </div>

                  <Link href={`/community/${id}/section/${section._id}`}>
                    <Button colorScheme="green" className="mt-2">Create Post in this Section</Button>
                  </Link>
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
