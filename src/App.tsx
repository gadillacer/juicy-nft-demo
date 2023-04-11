import { useCallback, useEffect, useRef, useState } from "react";
import './App.css';
import { useSmartAccountContext } from "./contexts/SmartAccountContext";
import { useWeb3AuthContext } from "./contexts/SocialLoginContext";
import { ToastContainer } from "react-toastify";
import Button from "./components/Button";
import MintNft from "./components/AA/MintNft";

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import styled from '@emotion/styled';


// Replace this link with your registered project
const jucciProjectUrl = "https://juccipay.vercel.app/projects/6433d30362a98d989b7abc76"

function App() {
  const {
    address: biconomyAddress,
    loading: eoaLoading,
    connect,
    disconnect,
    web3Provider
  } = useWeb3AuthContext();
  const {
    selectedAccount,
    loading: scwLoading,
    setSelectedAccount,
    state: walletState, wallet
  } = useSmartAccountContext();

  const interval = useRef<any>()

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Button
          onClickFunc={
            !biconomyAddress
              ? connect
              : () => {
                  setSelectedAccount(null);
                  disconnect();
                }
          }
          title={!biconomyAddress ? "Connect Wallet" : "Disconnect Wallet"}
        />
        {eoaLoading && <h2>Loading EOA...</h2>}

        {biconomyAddress && (
          <div>
            <h2>EOA Address</h2>
            <p>{biconomyAddress}</p>
          </div>
        )}

        {scwLoading && <h2>Loading Smart Account...</h2>}

        {selectedAccount && biconomyAddress && (
            <div>
              <h2>Smart Account Address</h2>
              <p>{selectedAccount.smartAccountAddress}</p>
          </div>
        )}

        {selectedAccount && <MintNft />}
        <br />

        <Typography variant="h6" gutterBottom>
          Fund this project gas at:{' '}
          <StyledLink href={jucciProjectUrl}>
            <Typography variant="h6" component="span">
              Jucci
            </Typography>
          </StyledLink>
        </Typography>
      
        <ToastContainer />
    </div>
  );
}

const StyledLink = styled(Link)`
  color: #3f51b5; /* Replace with your preferred faded-blue color */
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: #283593; /* Replace with your preferred hover color */
    text-decoration: underline;
  }
`;

export default App;