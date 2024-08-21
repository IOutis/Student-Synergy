import { useState, useEffect } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            
        <Box p={4}>
            <Text fontSize="2xl" mb={4}>Leaderboard</Text>
            <VStack spacing={4} align="start">
                {users.map((user, index) => (
                    <Box key={user._id} p={4} borderWidth="1px" borderRadius="md" width="100%">
                        <Text fontSize="lg" fontWeight="bold">{index + 1}. {user.email}</Text>
                        <Text>Level: {user.level}</Text>
                        <Text>Experience: {user.experience}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
        </div>
    );
};

export default Leaderboard;
