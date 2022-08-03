import Head from "next/head";
import "/resources/styles/globals.css";
import { Toaster, toast } from "react-hot-toast";
import MainLayout from "../components/Layout";
import { createContext, useEffect, useState } from "react";
import { web3, provider, saveWalletInfo } from "../utils/web3";
import ErrorBoundary from "../components/ErrorBoundary";
import LogIn from "/components/Templates/SignIn";

export const Web3Context = createContext([{}, () => {}]);

const MyApp = ({ Component, pageProps }) => {
  const [userInfo, setUserInfo] = useState();
  const [isProvider, setIsProvider] = useState(true);
  const [network, setNetwork] = useState("");

  /**
   * Checks if the selected network in Metamask is the Rinkeby test network and
   * prompts to change it if not
   * @returns {Promise<void>}
   */
  const fetch = async () => {
    const network = await web3.eth.net.getNetworkType();
    setNetwork(network);
    if (network !== "rinkeby") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4" }],
      });
    }
  };

  const handleChainChange = async (chainId) => {
    await saveWalletInfo(setUserInfo, toast);
    chainId !== "0x4" && window.location.reload();
    toast.success("Main chain changed!");
  };

  const handleAccountsChange = async (accounts) => {
    await saveWalletInfo(setUserInfo, toast);
    toast.success("Account change detected!");
  };

  useEffect(() => {
    fetch();
  }, [userInfo]);

  useEffect(() => {
    if (!provider || !provider.isMetaMask) {
      setIsProvider(false);
      toast.error("You need to install Metamask first!");
      return;
    }

    // Make sure to recognize if someone changes their metamask account and the mainnet
    provider.on("accountsChanged", handleAccountsChange);
    provider.on("chainChanged", handleChainChange);
    return () => [
      provider.removeListener("chainChanged", handleChainChange),
      provider.removeListener("accountsChanged", handleAccountsChange),
    ];
  }, []);

  const Layout = Component.layout ?? MainLayout;

  return (
    <Web3Context.Provider value={[userInfo, setUserInfo, network, isProvider]}>
      <Head>
        <title>Coinfund</title>
      </Head>
      <Layout>
        {network === "rinkeby" && userInfo && userInfo.account ? (
          <ErrorBoundary FallbackComponent={<p>Something went wrong!</p>}>
            <Component {...pageProps} />{" "}
          </ErrorBoundary>
        ) : (
          <>
            <LogIn isProvider={isProvider} />
          </>
        )}
      </Layout>
      <Toaster position="bottom-right" />
    </Web3Context.Provider>
  );
};

export default MyApp;
