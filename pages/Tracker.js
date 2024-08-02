// pages/index.js
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Habits from '../components/Habits';
import DailyTasks from '../components/DailyTasks';
import TodoList from '../components/TodoList';
import Rewards from '../components/Rewards';
import NavComp from '../components/NavComp';
import { useSession } from 'next-auth/react';
import LoadingComp from '../components/LoadingComp'

const Dashboard = () => {
  const { data: session, status } = useSession();
  if (!session) {
    return (<div> <NavComp></NavComp>
      <div style={{ display:"flex", justifyContent:"center", marginTop:"6vh"}}>
      <p>Please sign in to view your tasks.</p></div>
      </div>);
  }
  if (status === "loading") {
    return <LoadingComp></LoadingComp>;
  }

  return (
    <Box p="4">
      <NavComp></NavComp>
      <Heading mb="4" >Gamified Task Manager</Heading>
      <div className='flex flex-row p-6 justify-between max-w-[90%]' style={{paddingLeft:'6px', marginLeft:"4vw"}}>
      <Habits />
      <DailyTasks />
      <TodoList />
      <Rewards /></div>
    </Box>
  );
};

export default Dashboard;
