// pages/_app.js

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '../styles/globals.css';
import { TimerProvider } from './services/components/TimerContext';
import MiniPomodoroTimer from './services/components/MiniPomodoro';
import React, { useState } from "react";
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'; // Make sure to import the CSS file
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [miniState, setMiniState] = useState(false);

  const toggleTimer = () => {
    setMiniState(!miniState);
  };

  return (
    <SessionProvider session={session}>
      <TimerProvider>
        <div className="app-container">
          <Component {...pageProps} />

          <span
            className="transition ease-in-out duration-500 hover:scale-150"
            style={{ position: "fixed", bottom: "40px", right: "30px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-10"
              onClick={toggleTimer}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Mini Timer
          </span>

          {miniState && <MiniPomodoroTimer />}
        </div>
      </TimerProvider>
    </SessionProvider>
  );
}
