import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import ModalComponent from './Group_Task_Modal'; // Import the modal component

const SectionsComponent = ({ 
  sections, 
  community, 
  adminaccess, 
  handleDeleteSection, 
  handleDelete, 
  truncateHTMLContent,
  id
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useRef(true);
  
  // Use useCallback to memoize these functions
  const handleOpenModal = useCallback(() => {
    if (isMounted.current) {
      setIsModalOpen(true);
    }
  }, []);
  
  const handleCloseModal = useCallback(() => {
    if (isMounted.current) {
      setIsModalOpen(false);
    }
  }, []);
  
  const handleTaskSubmit = useCallback((task) => {
    console.log("New task:", task);
    // Implement your task submission logic here
  }, []);

  // Check that sections is actually an array before mapping
  const sectionsList = Array.isArray(sections) ? sections : [];
  // Safely get community data
  const communitySections = community && community.sections ? community.sections : [];
  const hasSections = communitySections.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sections</h2>
      {hasSections ? (
        sectionsList.map((section) => (
          section && section._id ? (
            <div key={section._id} className="mb-6 p-4 bg-gray-100 rounded-md shadow">
              <h3 className="text-xl font-bold text-blue-700">{section.title}</h3>
              {adminaccess && (
                <button 
                  className='ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition' 
                  onClick={() => typeof handleDeleteSection === 'function' && handleDeleteSection(section._id)}
                >
                  Delete Section
                </button>
              )}
              <p className="text-gray-600">{section.description}</p>
              
              <div className="mt-4">
                {section.posts && section.posts.length > 0 ? (
                  <div>
                    <h4 className="font-semibold">Posts:</h4>
                    <ul className="list-disc pl-5">
                      {section.posts.map((post) => (
                        post && post._id ? (
                          <li key={post._id} className="text-gray-700">
                            <Link href={`/post/${post._id}`}>
                              <p className="text-blue-600 hover:underline">{post.title}</p>
                            </Link>
                            {typeof truncateHTMLContent === 'function' && (
                              <p 
                                dangerouslySetInnerHTML={{
                                  __html: truncateHTMLContent(post.content, 70)
                                }}
                              />
                            )}
                            {adminaccess && (
                              <button
                                className="ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                                onClick={() => typeof handleDelete === 'function' && handleDelete(post._id)}
                              >
                                Delete
                              </button>
                            )}
                          </li>
                        ) : null
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No posts available in this section.</p>
                )}
              </div>
          
              {(section.qaSection || adminaccess) && (
                <Link href={`/community/${id}/section/${section._id}`}>
                  <Button colorScheme="green" className="mt-2">Create Post in this Section</Button>
                </Link>
              )}
              {(section.taskSection && adminaccess) && (
                <div>
                  <Button colorScheme="green" className="mt-2 ml-2" onClick={handleOpenModal}>
                    Create a Group Task
                  </Button>
                </div>
              )}
            </div>
          ) : null
        ))
      ) : (
        <p className="text-gray-600">No sections available. Please ask an admin to add one.</p>
      )}

      {/* Only render the modal when it's open */}
      {isModalOpen && (
        <ModalComponent 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          communities={community ? [community] : []} 
          onSubmit={handleTaskSubmit} 
          community_id={community && community._id} 
        />
      )}
    </div>
  );
};

export default SectionsComponent;