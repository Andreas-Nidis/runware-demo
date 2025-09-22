import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Runware } from '@runware/sdk-js';

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
  return (
    <>
      <GlobalStyle />
    </>
  );
};

export default RunwareDemo;