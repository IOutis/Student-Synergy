// pages/services/components/TimerContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for the timer
const TimerContext = createContext();

// Timer Provider component
export const TimerProvider = ({ children }) => {
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
            sendNotification();
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
    requestNotificationPermission();
  };

  const stopTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'denied') {
          console.log('User denied notification permission');
        }
      });
    }
  };

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: 'Time is up! Take a break.',
      });
    } else {
      console.log('Notification permission not granted');
    }
  };

  return (
    <TimerContext.Provider value={{ minutes, seconds, isActive, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
