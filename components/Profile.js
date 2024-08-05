import React, { useEffect, useState, useRef } from 'react';
import { Box, Heading, Text, Progress, VStack, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const prevLevelRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/user/get_user?email=${session.user.email}`);
          if (res.ok) {
            const data = await res.json();
            setUserInfo(data);

            console.log("data Level =", data.level);
            console.log("prev Level =", prevLevelRef.current);

            if (prevLevelRef.current === null) {
              prevLevelRef.current = data.level; // Initialize prevLevelRef on first fetch
              console.log("Setting prev to new data.level");
            } else if (data.level > prevLevelRef.current) {
              toast({
                title: `Level Up!`,
                description: `Congratulations! You've reached level ${data.level}.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
              });
              prevLevelRef.current = data.level; // Update prevLevelRef on level up
            }
          } else {
            console.error('Failed to fetch user');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      // Fetch user data initially
      fetchUser();

      // Set up polling to fetch user data every 3 seconds
      const intervalId = setInterval(fetchUser, 3000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [session, toast]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  let nextLevelExp, userLevelName;
  if (userInfo.experience <= 30) {
    nextLevelExp = 30;
    userLevelName = "Newbie";
  } else if (userInfo.experience > 30 && userInfo.experience < 100) {
    nextLevelExp = 100;
    userLevelName = "Novice";
  } else if (userInfo.experience > 100 && userInfo.experience < 170) {
    nextLevelExp = 170;
    userLevelName = "Apprentice";
  } else if (userInfo.experience > 170 && userInfo.experience < 240) {
    nextLevelExp = 240;
    userLevelName = "Journeyman";
  }

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Heading size="md">Profile</Heading>
      <VStack align="start" spacing="4" mt="4">
        <Text><strong>Name:</strong> {session.user.name}</Text>
        <Text><strong>Email:</strong> {userInfo.email}</Text>
        <Text><strong>Level:</strong> {userInfo.level} ({userLevelName})</Text>
        <Text><strong>Experience:</strong> {userInfo.experience} / {nextLevelExp}</Text>
        <Progress value={(userInfo.experience / nextLevelExp) * 100} size="sm" colorScheme="green" />
        {userInfo.skills && (
          <Text><strong>Skills:</strong> {userInfo.skills.join(', ')}</Text>
        )}
        <Text><strong>Coins:</strong> {userInfo.coins}</Text>
      </VStack>
    </Box>
  );
};

export default Profile;
