import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Web3AuthProvider } from "./contexts/SocialLoginContext";
import { SmartAccountProvider } from "./contexts/SmartAccountContext";
import "@biconomy-sdk-dev/web3-auth/dist/src/style.css"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <Web3AuthProvider>
      {/* <Web3Provider> */}
      <SmartAccountProvider>
            <App />

      </SmartAccountProvider>
      {/* </Web3Provider> */}
    </Web3AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
