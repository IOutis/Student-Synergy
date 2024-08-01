// components/Rewards.js
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddReward = (e) => {
    e.preventDefault();
    const newReward = {
      title: e.target.title.value,
      points: parseInt(e.target.points.value, 10),
    };
    setRewards([...rewards, newReward]);
    setShowForm(false);
  };

  return (
    <Box>
      <Button onClick={() => setShowForm(!showForm)} style={{color:"white"}}>+ Add Reward</Button>
      {showForm && (
        <form onSubmit={handleAddReward} style={{color:"white"}}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input name="title" style={{color:"black"}}/>
          </FormControl>
          <FormControl>
            <FormLabel>Points</FormLabel>
            <Input name="points" type="number" style={{color:"black"}}/>
          </FormControl>
          <Button type="submit" style={{color:"white"}}>Add Reward</Button>
        </form>
      )}
      <Box style={{color:"white"}}>
        {rewards.map((reward, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" p="4" my="2">
            <h2>{reward.title}</h2>
            <p>{reward.points} points</p>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Rewards;
