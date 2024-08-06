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

if (userInfo.experience <= 50) {
  nextLevelExp = 50;
  userLevelName = "Novice";
} else if (userInfo.experience > 50 && userInfo.experience <= 150) {
  nextLevelExp = 150;
  userLevelName = "Apprentice";
} else if (userInfo.experience > 150 && userInfo.experience <= 300) {
  nextLevelExp = 300;
  userLevelName = "Journeyman";
} else if (userInfo.experience > 300 && userInfo.experience <= 500) {
  nextLevelExp = 500;
  userLevelName = "Skilled";
} else if (userInfo.experience > 500 && userInfo.experience <= 750) {
  nextLevelExp = 750;
  userLevelName = "Expert";
} else if (userInfo.experience > 750 && userInfo.experience <= 1050) {
  nextLevelExp = 1050;
  userLevelName = "Master";
} else if (userInfo.experience > 1050 && userInfo.experience <= 1400) {
  nextLevelExp = 1400;
  userLevelName = "Grandmaster";
} else if (userInfo.experience > 1400 && userInfo.experience <= 1800) {
  nextLevelExp = 1800;
  userLevelName = "Legend";
} else if (userInfo.experience > 1800 && userInfo.experience <= 2250) {
  nextLevelExp = 2250;
  userLevelName = "Champion";
} else if (userInfo.experience > 2250) {
  nextLevelExp = 2750; // Assuming the highest level is Mythic
  userLevelName = "Mythic";
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
