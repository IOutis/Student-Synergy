// src/components/PomodoroTimer.js

import React,{useState,useEffect} from 'react';

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            sendNotification(); // Send notification when timer ends
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const startTimer = () => {
    setIsActive(true);
    requestNotificationPermission(); // Request permission when timer starts
  };

  const stopTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: 'Time is up! Take a break.',
      });
    }
  };

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
