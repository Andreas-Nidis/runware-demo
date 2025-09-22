import { useEffect, useState } from 'react';
import { styled, keyframes, createGlobalStyle } from 'styled-components';
import { Runware } from '@runware/sdk-js';

let runware;

const RunwareDemo = () => {
  const [activeTab, setActiveTab] = useState('image');
  // const [isInitialized, setIsInitialized] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [status, setStatus] = useState('Initializing...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [numberOfResults, setNumberOfResults] = useState(1);
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

  const scrollToGenerators = () => {
    document.getElementById('generators')?.scrollIntoView({ behavior: 'smooth' });
  };

  const numberOptions = [1, 2, 3, 4, 5];

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Runware AI Generator</Title>
          <Subtitle>Create stunning images and videos with AI-powered generation</Subtitle>
          <ScrollIndicator onClick={scrollToGenerators}>
            ↓
          </ScrollIndicator>
        </Header>

        <section id="generators">
          <ToggleContainer>
            <ToggleButton 
              active={activeTab === 'image'} 
              onClick={() => setActiveTab('image')}
            >
              Image
            </ToggleButton>
            <ToggleButton 
              active={activeTab === 'video'} 
              onClick={() => setActiveTab('video')}
            >
              Video
            </ToggleButton>
          </ToggleContainer>

          <GeneratorSection>
            <h2 style={{color: '#ffffff', marginBottom: '10px'}}>
              {activeTab === 'image' ? 'Image' : 'Video'} Generation
            </h2>

            <p style={{color: '#e0e0e0', marginBottom: '20px'}}>
              Enter your prompt to generate {activeTab === 'image' ? 'images' : 'videos'}
            </p>

            <PromptInput
              placeholder={`Describe the ${activeTab} you want to generate...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <ControlsContainer>
              <NumberSelectorContainer>
                <NumberSelectorLabel>
                  Number of {activeTab === 'image' ? 'Images' : 'Videos'}:
                </NumberSelectorLabel>
                <NumberSelector>
                  {numberOptions.map((number) => (
                    <NumberButton
                      key={number}
                      active={numberOfResults === number}
                      onClick={() => setNumberOfResults(number)}
                      disabled={isGenerating}
                    >
                      {number}
                    </NumberButton>
                  ))}
                </NumberSelector>
              </NumberSelectorContainer>
            </ControlsContainer>
            
          </GeneratorSection>
        </section>
        


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

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;


// Component Styles
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
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

const ScrollIndicator = styled.div`
  font-size: 2.3rem;
  animation: ${pulse} 2s infinite;
  cursor: pointer;
  color: #9d4edd;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 5px;
  width: 300px;
  margin: 0 auto 40px;
  backdrop-filter: blur(10px);
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #7b2cbf, #9d4edd)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#b0b0b0'};
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    color: ${props => props.active ? 'white' : '#e0e0e0'};
    background: ${props => props.active ? 'linear-gradient(90deg, #7b2cbf, #9d4edd)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const GeneratorSection = styled.section`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  animation: ${fadeIn} 1s ease-out;
  backdrop-filter: blur(10px);
`;

const PromptInput = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 15px;
  color: white;
  font-size: 1rem;
  margin-bottom: 20px;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #a0a0a0;
  }
  
  &:focus {
    outline: none;
    border-color: #9d4edd;
    box-shadow: 0 0 0 3px rgba(157, 78, 221, 0.2);
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const NumberSelectorContainer = styled.div`
  width: 15rem;
  gap: 10px;
`;

const NumberSelectorLabel = styled.label`
  color: #e0e0e0;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NumberSelector = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
`;

const NumberButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  background: ${props => props.active ? 'linear-gradient(90deg, #7b2cbf, #9d4edd)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#b0b0b0'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? 'linear-gradient(90deg, #7b2cbf, #9d4edd)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${props => props.active ? 'white' : '#e0e0e0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
`;