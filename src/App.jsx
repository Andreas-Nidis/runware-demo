import { useEffect, useState } from 'react';
import { styled, keyframes, createGlobalStyle } from 'styled-components';
import { Runware } from '@runware/sdk-js';

let runware;

const RunwareDemo = () => {
  const [activeTab, setActiveTab] = useState('image');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [numberOfResults, setNumberOfResults] = useState(1);
  const [results, setResults] = useState([]);
  
  // Initialize Runware SDK
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

  // Helper function to extract error messages
  const getErrorMessage = error => {
    if (!error) return "Unknown error";

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "object") {
      try {
        // If it's a Runware error payload
        if ("error" in error && typeof error.error === "object") {
          const inner = error.error;
          if (inner.message) return inner.message;
        }
        // Generic object with a message
        if ("message" in error && typeof error.message === "string") {
          return error.message;
        }
        if (Array.isArray(error)) {
          return error.map(e => getErrorMessage(e)).join(", ");
        }
        return JSON.stringify(error); // Fallback scenario
      } catch {
        return String(error);
      }
    }

    return String(error);
  };

  // Handle generation requests
  const handleGenerate = async () => {
    if (!prompt.trim() || !isInitialized) return;

    setIsGenerating(true);
    setStatus(`Generating ${numberOfResults} ${activeTab}(s)...`);
    setIsError(false);
    setResults([]); // Clear previous results

    try {
      if (activeTab === 'image') {
        
        // Generate images using Runware API
        // Faster model is used for demo purposes
        // Smaller size used for faster generation during peak hours
        const images = await runware.requestImages({
          taskType: "imageInference",
          positivePrompt: prompt,
          model: "runware:100@1", 
          width: 256, 
          height: 256,
          numberResults: numberOfResults,
          onPartialImages: (partialImages, error) => { 

            if (error) {
              setStatus(`Error: ${getErrorMessage(error)}`); 
              setIsError(true);
            } else if (partialImages && partialImages.length > 0) {
              setStatus(`Generated ${partialImages.length} of ${numberOfResults} image(s)...`);

              // Update results with the new images
              const newResults = partialImages.map(img => img.imageURL);
              setResults(prev => [...prev, ...newResults]);
            }
          },
        });

        // Set final results
        if (images && images.length > 0) {
          const imageUrls = images.map((img) => img.imageURL);
          setResults(imageUrls);
          setStatus(`Successfully generated ${images.length} image(s)!`);
        }
      } else {
        // Generate video using Runware API
        setStatus(`Video generation started for ${numberOfResults} video(s). This may take several minutes...`);

        const videos = await runware.videoInference({
          taskType: "videoInference",
          positivePrompt: prompt,
          model: "klingai:5@3",
          deliveryMethod: "async",
          duration: 5,
          fps: 24,
          width: 1080,
          height: 1080,
          numberResults: numberOfResults,
          onPartialVideos: (partialVideos, error) => {

            if (error) {
              setStatus(`Error: ${getErrorMessage(error)}`);
              setIsError(true);
            } else if (partialVideos && partialVideos.length > 0) {
              setStatus(`Received ${partialVideos.length} of ${numberOfResults} partial video(s)...`);

              // Update results with the new videos
              const newResults = partialVideos.map(vid => vid.videoURL);
              setResults(prev => [...prev, ...newResults]);
            }
          }
        });

        // Final result
        if (videos && videos.length > 0) {
          const videoUrls = videos.map(vid => vid.videoURL);
          setResults(videoUrls);
          setStatus(`Video generation completed! Created ${videos.length} video(s).`);
        }
      }
    } catch (error) {
      setStatus(`Error: ${getErrorMessage(error)}`);
      setIsError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Smooth scroll to generators section
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

            {status && <StatusMessage error={isError}>{status}</StatusMessage>}

            <GenerateButton 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim() || !isInitialized}
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner />
                  Generating {numberOfResults} {activeTab === 'image' ? 'Image(s)' : 'Video(s)'}...
                </>
              ) : (
                `Generate ${numberOfResults} ${activeTab === 'image' ? 'Image(s)' : 'Video(s)'}`
              )}
            </GenerateButton>

            {results.length > 0 && (
              <ResultsContainer>
                <h3 style={{color: '#ffffff'}}>
                  Generated Results ({results.length} of {numberOfResults}):
                </h3>
                <ResultGrid count={results.length}>
                  {activeTab === 'image' ? (
                    results.map((result, index) => (
                      <ResultImage 
                        key={index} 
                        src={result} 
                        alt={`Generated image ${index + 1}`} 
                      />
                    ))
                  ) : (
                    results.map((result, index) => (
                      <ResultVideo key={index} src={result} controls />
                    ))
                  )}
                </ResultGrid>
              </ResultsContainer>
            )}
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

const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
  background: ${props => props.error ? 'rgba(255, 0, 0, 0.1)' : 'rgba(157, 78, 221, 0.1)'};
  border: 1px solid ${props => props.error ? 'rgba(255, 100, 100, 0.3)' : 'rgba(157, 78, 221, 0.3)'};
  color: ${props => props.error ? '#ff6b6b' : '#9d4edd'};
  text-align: center;
  font-weight: 500;
`;

const GenerateButton = styled.button`
  background: linear-gradient(90deg, #7b2cbf, #9d4edd);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(157, 78, 221, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #5a5a5a;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    color: #b0b0b0;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #9d4edd;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
  display: grid;
  gap: 20px;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.count === 1 ? '1fr' : props.count === 2 ? '1fr 1fr' : '1fr 1fr 1fr'};
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => props.count <= 2 ? '1fr' : '1fr 1fr'};
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ResultImage = styled.img`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ResultVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;