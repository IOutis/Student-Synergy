// pages/_app.js

import "@/styles/globals.css";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import 'react-tippy/dist/tippy.css'; // Make sure to import the CSS file
import { Analytics } from "@vercel/analytics/react"
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [miniState, setMiniState] = useState(false);

  const toggleTimer = () => {
    setMiniState(!miniState);
  };

  return (
    <SessionProvider session={session}>
      
        <div className="app-container">
          <Component {...pageProps} />
          
          <Analytics />
        </div>
      
    </SessionProvider>
  );
}
