// src/components/PomodoroTimer.js

import React from 'react';
import { useTimer } from './TimerContext';

const PomodoroTimer = () => {
  const { minutes, seconds, isActive, startTimer, stopTimer, resetTimer } = useTimer();

  return (
    <div className="timerContainer">
      <div className="time">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <button className="button" onClick={startTimer} disabled={isActive}>Start</button>
      <button className="button" onClick={stopTimer} disabled={!isActive}>Stop</button>
      <button className="button" onClick={resetTimer}>Reset</button>
      <style jsx>{`
        .timerContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .time {
          font-size: 2em;
          margin-bottom: 20px;
        }
        .button {
          margin: 5px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .button:hover {
          background-color: #45a049;
        }
        .button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PomodoroTimer;
