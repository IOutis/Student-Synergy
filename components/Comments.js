import { useState, useEffect } from 'react';
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const CustomEditor = dynamic(() => import('../components/Com_ckeditor'), { ssr: false });

const Comments = ({ postId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comm_post/get_comments?postId=${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const renderComments = (comments, parentId = null) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <Box key={comment._id} p={2} borderWidth="1px" borderRadius="md" mb={2}>
          <strong>{comment.user}</strong>
          <div dangerouslySetInnerHTML={{ __html: comment.content }} />
          <Button onClick={() => {
            setReplyingTo(comment._id);
            onOpen();
          }} size="sm" mt={2}>Reply</Button>
          <Box ml={6}>
            {renderComments(comments, comment._id)} {/* Recursively render replies */}
          </Box>
        </Box>
      ));
  };

  return (
    <Box mt={4}>
      <Button onClick={onOpen} colorScheme="blue">Add Comment</Button>

      <Modal isOpen={isOpen} onClose={() => {
        setReplyingTo(null);
        onClose();
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{replyingTo ? 'Reply to Comment' : 'Add a Comment'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CustomEditor postId={postId} parentId={replyingTo} onClose={onClose} onCommentAdded={setComments} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box mt={4}>
        {renderComments(comments)}
      </Box>
    </Box>
  );
};

export default Comments;
