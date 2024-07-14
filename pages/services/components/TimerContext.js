
import React, { createContext, useState, useEffect, useContext } from 'react';

const TimerContext = createContext();

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
    <TimerContext.Provider value={{ minutes, seconds, isActive, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
