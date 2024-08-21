import React from 'react'
import Leaderboard from '../components/LeaderBoardComp'
import NavComp from '../components/NavComp';

export default function LeaderBoardPage() {
  return (
    <div>
        <NavComp></NavComp>
        <p>Don't see your name. Try adding habits, dailies, To-do tasks and refresh this page</p>
      <Leaderboard></Leaderboard>
    </div>
  )
}
