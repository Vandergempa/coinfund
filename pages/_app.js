import Head from "next/head";
import "/resources/styles/globals.css";
import { Toaster } from "react-hot-toast";
import MainLayout from "../components/Layout";
import { createContext, useEffect, useState } from "react";
import { web3 } from "../utils/web3";
import ErrorBoundary from "../components/ErrorBoundary";
import LogIn from "/components/Templates/SignIn";

export const Web3Context = createContext([{}, () => {}]);

const MyApp = ({ Component, pageProps }) => {
  const [userInfo, setUserInfo] = useState();
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

  useEffect(() => {
    fetch();
  }, [userInfo]);

  const Layout = Component.layout ?? MainLayout;

  return (
    <Web3Context.Provider value={[userInfo, setUserInfo, network]}>
      <Head>
        <title>Coinfund</title>
      </Head>
      <Layout>
        <ErrorBoundary FallbackComponent={<p>Something went wrong!</p>}>
          {network === "rinkeby" && userInfo && userInfo.account ? (
            <Component {...pageProps} />
          ) : (
            <>
              <LogIn />
            </>
          )}
        </ErrorBoundary>
      </Layout>
      <Toaster position="bottom-right" />
    </Web3Context.Provider>
  );
};

export default MyApp;
