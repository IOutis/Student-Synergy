
import React from 'react';
import Draggable from 'react-draggable';
import PomodoroTimer from './Pomodoro';

const MiniPomodoroTimer = () => {
  return (
    <Draggable>
      <div style={{ width: '200px', padding: '10px', border: '1px solid black', borderRadius: '5px', background: 'grey', cursor:"move" }}>
        <PomodoroTimer />
      </div>
    </Draggable>
  );
};

export default MiniPomodoroTimer;
