import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context for the timer
const TimerContext = createContext();

// Timer Provider component
export const TimerProvider = ({ children }) => {
  // State variables for timer
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);

  // Effect hook for timer logic
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            sendNotification(); // Notify when timer ends
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

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  // Functions for timer control
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

  // Function to request notification permission
  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'denied') {
          console.log('User denied notification permission');
          // Handle denial case
        }
      });
    }
  };

  // Function to send notification
  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: 'Time is up! Take a break.',
      });
    } else {
      console.log('Notification permission not granted');
      // Handle lack of permission
    }
  };

  // Provide timer state and functions via context
  return (
    <TimerContext.Provider value={{ minutes, seconds, isActive, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

// Hook to use the timer context
export const useTimer = () => useContext(TimerContext);
