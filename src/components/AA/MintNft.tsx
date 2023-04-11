import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { makeStyles } from "@mui/styles";

import Button from "../Button";
import { useWeb3AuthContext } from "../../contexts/SocialLoginContext";
import { useSmartAccountContext } from "../../contexts/SmartAccountContext";
import {
  configInfo as config,
  showErrorMessage,
  showSuccessMessage,
  formatBalance
} from "../../utils";

const MintNft: React.FC = () => {
  const classes = useStyles();
  const { web3Provider, address: eoaAddress } = useWeb3AuthContext();
  const { 
    state: walletState, 
    wallet, 
    getSmartAccountBalance, 
    isFetchingBalance, 
    balance 
  } = useSmartAccountContext();
  const [scwNftCount, setSCWNftCount] = useState<number | null>(null);
  const [eoaNftCount, setEOANftCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getNftCount = useCallback(async () => {
    if (!walletState?.address || !web3Provider) return;
    console.log("go through precheck Nftcount")
    console.log("passed the nftCount pre-check")
    const nftContract = new ethers.Contract(
      config.nft.address,
      config.nft.abi,
      web3Provider
    );
    const scwCount = await nftContract.balanceOf(walletState?.address);
    setSCWNftCount(Number(scwCount));

    const eoaCount = await nftContract.balanceOf(eoaAddress);
    setEOANftCount(Number(eoaCount))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSmartAccountBalanceFunc = useCallback(async () => {
    const error = await getSmartAccountBalance();
    if (error) showErrorMessage(error);
  }, [getSmartAccountBalance]);

  useEffect(() => {
    getNftCount();
  }, [getNftCount, walletState?.address]);

  useEffect(() => {
    getSmartAccountBalanceFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mintNft = async (shouldMintToEOA: boolean) => {
    if (!wallet || !walletState || !web3Provider) return;
    try {
      setLoading(true);
      let smartAccount = wallet;
      const nftContract = new ethers.Contract(
        config.nft.address,
        config.nft.abi,
        web3Provider
      );
      console.log("smartAccount.address ", smartAccount.address);
      const address = shouldMintToEOA ? eoaAddress : smartAccount.address;
      const safeMintTx = await nftContract.populateTransaction.mint(
        address,
        1
      );
      console.log(safeMintTx.data);
      const tx1 = {
        to: config.nft.address,
        data: safeMintTx.data,
      };

      const txResponse = await smartAccount.sendGaslessTransaction({
        transaction: tx1,
      });
      console.log("Tx sent, userOpHash:", txResponse);
      console.log("Waiting for tx to be mined...");
      const txHash = await txResponse.wait();
      console.log("txHash", txHash);
      showSuccessMessage(
        `Minted Nft ${txHash.transactionHash}`,
        txHash.transactionHash
      );
      getNftCount();
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      showErrorMessage(err.message || "Error in sending the transaction");
    }
  };

  return (
    <main className={classes.main}>

      <div className={classes.element}>
        <div className={classes.balance}>
          <p>Tokens</p>
        </div>
        {balance.alltokenBalances.map((token, ind) => (
          <div className={classes.balance} key={ind}>
            <div className={classes.tokenTitle}>
              <img
                className={classes.img}
                src={token.logo_url}
                onError={({ currentTarget }) => {
                  currentTarget.src =
                    "https://cdn.icon-icons.com/icons2/3947/PNG/512/cash_currency_money_finance_exchange_coin_bitcoin_icon_251415.png";
                }}
                alt=""
              />
              <p>{token.contract_ticker_symbol}</p>
            </div>
            <p>{formatBalance(token.balance, token.contract_decimals)}</p>
          </div>
        ))}
      </div>

      <h3 className={classes.subTitle}>Mint Gasless NFT</h3>

      <p style={{ marginBottom: 20 }}>
        This is an example gasless transaction to Mint Nft.
      </p>
      <p>
        Nft Contract Address: {config.nft.address}{" "}
        <span style={{ fontSize: 13, color: "#FFB4B4" }}>
          (mumbai)
        </span>
      </p>
      <p style={{ marginBottom: 30 }}>
        Nft Balance in SCW:{" "}
        {scwNftCount === null ? (
          <p style={{ color: "#7E7E7E", display: "contents" }}>fetching...</p>
        ) : (
          scwNftCount
        )}
      </p>

      <Button title="Mint NFT" isLoading={loading} onClickFunc={() => mintNft(false)} />

      <br/> <br/>

      <p style={{ marginBottom: 30 }}>
        Nft Balance in EOA:{" "}
        {eoaNftCount === null ? (
          <p style={{ color: "#7E7E7E", display: "contents" }}>fetching...</p>
        ) : (
          eoaNftCount
        )}
      </p>

      <Button title="Mint to EOA" isLoading={loading} onClickFunc={() => mintNft(true)} />
    </main>
  );
};

const useStyles = makeStyles(() => ({
  main: {
    margin: "auto",
    padding: "10px 40px",
    color: "#7E7E7E",
  },
  subTitle: {
    fontFamily: "Rubik",
    color: "#BDC2FF",
    fontSize: 28,
  },
  h3Title: {
    color: "#fff",
  },
  element: {
    width: "100%",
    maxHeight: 600,
    height: 160,
    overflowY: "auto",
    border: "1px solid #5B3320",
    backgroundColor: "#151520",
    borderRadius: 12,
  },
  balance: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 25,
    padding: "0 10px",
    borderBottom: "1px solid #2C3333",
  },
  tokenTitle: {
    display: "flex",
    flexFlow: "reverse",
    alignItems: "center",
  },
  img: {
    width: 35,
    height: 35,
    border: "1px solid #2C3333",
    borderRadius: "50%",
    marginRight: 10,
  },
}));

export default MintNft;
