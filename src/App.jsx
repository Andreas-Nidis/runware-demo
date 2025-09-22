import { useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Runware } from '@runware/sdk-js';

let runware;

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    scroll-behavior: smooth;
  }

  body {
    background: linear-gradient(135deg, #1e1c27, #34313a, #212023);
    color: #ffffff;
    min-height: 100vh;
  }
  
  html {
    scroll-behavior: smooth;
  }
`;

const RunwareDemo = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState('Initializing...');


  useEffect(() => {
    const initializeRunware = async () => {
      try {
        setStatus('Initializing Runware SDK...');
        
        // Get API key from environment variables
        const apiKey = import.meta.env.VITE_RUNWARE_API_KEY;
        
        if (!apiKey) {
          throw new Error('Runware API key not found in environment variables');
        }
        
        // Initialize Runware
        runware = await Runware.initialize({
          apiKey: apiKey,
          shouldReconnect: true,
          globalMaxRetries: 3,
          timeoutDuration: 60000, // 5 minutes timeout
        });
        
        setIsInitialized(true);
        setStatus('Runware SDK initialized successfully!');
        setTimeout(() => setStatus(null), 3000);
      } catch (error) {
        console.error('Failed to initialize Runware:', error);
        setStatus(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
        setIsError(true);
      }
    };

    initializeRunware();
  }, []);

  return (
    <>
      <GlobalStyle />
    </>
  );
};

export default RunwareDemo;