import React, { useEffect, useState, useRef } from 'react';
import { Box, Heading, Text, Progress, VStack, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import LoadingComp from './LoadingComp';
const Profile = () => {
  const { data: session ,status} = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const prevLevelRef = useRef(null);
  const prevSkillsRef = useRef([]);
  const prevCoinsRef = useRef(0);
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
            const newSkills = data.skills.filter(skill => !prevSkillsRef.current.includes(skill));
            if (newSkills.length > 0) {
              toast({
                title: 'New Skills Acquired!',
                description: `You have gained new skills: ${newSkills.join(', ')}.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
              });
              prevSkillsRef.current = data.skills; // Update prevSkillsRef
            }
            if (data.coins > prevCoinsRef.current) {
              const coinsAdded = data.coins - prevCoinsRef.current;
              toast({
                title: 'Coins Added!',
                description: `You have earned ${coinsAdded} coins.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
              });
              prevCoinsRef.current = data.coins; // Update prevCoinsRef
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

  // if (!userInfo) {
  //   return <div>Loading...</div>;
  // }
   if(status == "loading"){
    return <LoadingComp style={{marginLeft:"40%"}}></LoadingComp>;
   }

  let nextLevelExp, userLevelName;
if(userInfo){
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
}


  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Heading size="md">Profile</Heading>
      <VStack align="start" spacing="4" mt="4">
        <Text><strong>Name:</strong> {session.user.name}</Text>
        <Text><strong>Email:</strong> {userInfo?userInfo.email:session.user.email}</Text>
        <Text><strong>Level:</strong> {userInfo?userInfo.level:0} ({userLevelName?userLevelName:""})</Text>
        <Text><strong>Experience:</strong> {userInfo?userInfo.experience:0} / {nextLevelExp?nextLevelExp:1}</Text>
        <div style={{backgroundColor:"red", width:"50%"}}><Progress value={userInfo?(userInfo.experience / nextLevelExp) * 100:0} size="xs" colorScheme="green"/></div>
        {userInfo && (
          <Text><strong>Skills:</strong> {userInfo.skills?userInfo.skills.join(', '):"No skills earned yet"}</Text>
        )}
        <Text><strong>Coins:</strong> {userInfo?userInfo.coins:0}</Text>
        <Progress value={20} size='xs' colorScheme='pink' />
        {/* <LoadingComp></LoadingComp> */}
      </VStack>
    </Box>
  );
};

export default Profile;
