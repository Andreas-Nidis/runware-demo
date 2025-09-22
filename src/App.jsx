import { useEffect, useState } from 'react';
import { styled, keyframes, createGlobalStyle } from 'styled-components';
import { Runware } from '@runware/sdk-js';

let runware;

const RunwareDemo = () => {
  // const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [isInitialized, setIsInitialized] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [status, setStatus] = useState('Initializing...');
  // const [isGenerating, setIsGenerating] = useState(false);
  // const [prompt, setPrompt] = useState('');
  // const [numberOfResults, setNumberOfResults] = useState(1);
  // const [results, setResults] = useState([]);


  // useEffect(() => {
  //   const initializeRunware = async () => {
  //     try {
  //       setStatus('Initializing Runware SDK...');
        
  //       // Get API key from environment variables
  //       const apiKey = import.meta.env.VITE_RUNWARE_API_KEY;
        
  //       if (!apiKey) {
  //         throw new Error('Runware API key not found in environment variables');
  //       }
        
  //       // Initialize Runware
  //       runware = await Runware.initialize({
  //         apiKey: apiKey,
  //         shouldReconnect: true,
  //         globalMaxRetries: 3,
  //         timeoutDuration: 60000, // 5 minutes timeout
  //       });
        
  //       setIsInitialized(true);
  //       setStatus('Runware SDK initialized successfully!');
  //       setTimeout(() => setStatus(null), 3000);
  //     } catch (error) {
  //       console.error('Failed to initialize Runware:', error);
  //       setStatus(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
  //       setIsError(true);
  //     }
  //   };

  //   initializeRunware();
  // }, []);

  // getErrorMessage(error) will be a function created to handle different error types
  // const handleGenerate = async () => {
  //   if (!prompt.trim() || !isInitialized) return;

  //   setIsGenerating(true);
  //   setStatus(`Generating ${numberOfResults} ${activeTab}(s)...`);
  //   setIsError(false);
  //   setResults([]); // Clear previous results

  //   try {
  //     if (activeTab === 'image') {

  //       // Generate images using Runware API
  //       // Faster model is used for demo purposes
  //       // Smaller size used for faster generation during peak hours
  //       const images = await runware.requestImages({
  //         taskType: "imageInference",
  //         positivePrompt: prompt,
  //         model: "runware:100@1", 
  //         width: 256, 
  //         height: 256,
  //         numberResults: numberOfResults,
  //         onPartialImages: (partialImages, error) => { 
  //           if (error) {
  //             console.log("Images response:", images);
  //             console.error('Generation error:', error);
  //             // setStatus(`Error: ${getErrorMessage(error)}`); 
  //             setIsError(true);
  //           } else if (partialImages && partialImages.length > 0) {
  //             setStatus(`Generated ${partialImages.length} of ${numberOfResults} image(s)...`);
  //             // Update results with the new images
  //             const newResults = partialImages.map(img => img.imageURL);
  //             setResults(prev => [...prev, ...newResults]);
  //           }
  //         },
  //       });

  //       // Set final results
  //       if (images && images.length > 0) {
  //         const imageUrls = images.map((img) => img.imageURL);
  //         setResults(imageUrls);
  //         setStatus(`Successfully generated ${images.length} image(s)!`);
  //       }
  //     } else {
  //       // Generate video using Runware API
  //     }
  //   } catch (error) {
  //     console.error('Generation error:', error);
  //     // setStatus(`Error: ${getErrorMessage(error)}`); --- getErrorMessage will be a function to handle different error types
  //     setIsError(true);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Runware AI Generator</Title>
          <Subtitle>Create stunning images and videos with AI-powered generation</Subtitle>
        </Header>
        

      </Container>
    </>
  );
};

export default RunwareDemo;

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

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Component Styles
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  padding: 60px 0 40px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #9d4edd, #7b2cbf);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(157, 78, 221, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  line-height: 1.6;
  color: #e0e0e0;
`;