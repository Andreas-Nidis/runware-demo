# Runware Image & Video Generator Demo

A minimal web app that demonstrates how easy it is to build with the Runware API.

This project was created for a developer meetup demo scenario — showcasing how developers can integrate Runware into their apps with just a few lines of code.

## 🚀 Features

- Generate AI images from custom text prompts
- Generate AI videos from custom text prompts (async delivery)
- Simple, clean React-based UI
- Partial image streaming (`onPartialImages`) for real-time previews
- Error handling and loading states

## 🛠️ Tech Stack

- **React** — frontend framework
- **Vite** — dev build tool
- **Runware JS SDK** — API integration

## 📦 Setup

### 1. Clone repo
```bash
git clone https://github.com/Andreas-Nidis/runware-demo.git
cd runware-demo
```

### 2. Installing dependencies
```bash
npm install
```

### 3. Add environemnt variabels
Create a .env file in the project root, then add:
```bash
VITE_RUNWARE_API_KEY=your_api_key_here
```
👉 You will need credits on your Runware account to generate images and/or videos!

### 4. Run locally
```bash
npm run dev
```

## 💡 Usage

1. Enter a text prompt in the input field.
2. Click Generate Image or Generate Video.
3. Wait for results:
    - Images appear directly in the browser.
    - Videos are delivered asynchronously after processing.

## Example Prompts
- "A neon cyberpunk city skyline at night"
- "A watercolor painting of a cat sitting on a windowsill"
- "A short looping video of waves crashing against rocks"

## Key integration choices:
- **onPartialImages**: allows streaming previews for a better UX.
- **Async video delivery**: used since video generation can take longer.
- **Environment variables**: keeps API keys secure and out of source code.

## 📹 Demo Video
👉 Link to Demo Video (needs to be added)

This short walkthrough covers:
- The project UI
- Code integration highlights
- Why Runware is developer-friendly

## 🔮 Next Steps / Extensions

- Add multiple model options
- Include style presets (e.g., "anime", "photorealistic", "oil painting")
- Save generation history in local storage or a backend
- Deploy on Vercel/Netlify for easy sharing

## 📚 Resources
[Runware Docs](https://runware.ai/docs/en/getting-started/introduction "Runware Documentation")
[Runware Playground](https://my.runware.ai/playground?_gl=1*1qv5hwq*_gcl_aw*R0NMLjE3NTgyMDE4MTcuQ2owS0NRand1S25HQmhENUFSSXNBRDE5UnNZejZqSlpWZEFQekNTZ0pIMlpVODc2N2FEazlfZUZmdno5a0ROblpSa1l1Q3pDSHR6RlM4TWFBcTgtRUFMd193Y0I.*_gcl_au*MjA4ODk4NTA3NS4xNzU2NzM5MDA0Ljk2MDgwMDkyNi4xNzU4NTY1MzQ4LjE3NTg1NjUzNTQ.*_ga*MTE1ODI2ODU4LjE3NTY3MzkwMDQ.*_ga_WVXGF7DB6P*czE3NTg1NzEwOTgkbzEzJGcwJHQxNzU4NTcxMTAzJGo1NSRsMCRoMA..&modelAIR=runware%3A101%401&modelArchitecture=flux1d "Runware Playground")
[Runware Blog](https://runware.ai/blog "Runware Blog")


✨ Built for the Runware Graduate Role Practical Assessment.