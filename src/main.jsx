import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { isEdgeBrowser, disableCopilotFeatures } from './utils/browserCheck.js'

// Block Microsoft Edge browser
if (isEdgeBrowser()) {
  // Disable all Copilot shortcuts and features
  disableCopilotFeatures();
  
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: Arial, sans-serif;
      color: white;
      text-align: center;
      padding: 20px;
    ">
      <h1 style="font-size: 2.5rem; margin-bottom: 20px;">⚠️ Browser Not Supported</h1>
      <p style="font-size: 1.2rem; max-width: 600px; line-height: 1.6;">
        This website is not compatible with Microsoft Edge.
        Please use <strong>Google Chrome</strong>, <strong>Mozilla Firefox</strong>, or <strong>Safari</strong> instead.
      </p>
      <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
        <p style="margin: 10px 0;">Recommended browsers:</p>
        <ul style="text-align: left; display: inline-block;">
          <li><a href="https://www.google.com/chrome/" target="_blank" style="color: #4CAF50; text-decoration: none;">Google Chrome</a></li>
          <li><a href="https://www.mozilla.org/firefox/" target="_blank" style="color: #FF6B6B; text-decoration: none;">Mozilla Firefox</a></li>
          <li><a href="https://www.apple.com/safari/" target="_blank" style="color: #4ECDC4; text-decoration: none;">Safari</a></li>
        </ul>
      </div>
    </div>
  `;
} else {
  // For non-Edge browsers, still initialize the app normally
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}