import { useContext } from "react";
import WalletAlert from "../WalletAlert";
import { handleWalletConnect } from "../../utils/web3";
import { toast } from "react-hot-toast";
import { Web3Context } from "../../pages/_app";

/**
 * Login component that is shown when Metamask is not connected to the test network and there is no
 * account information in the context
 * @returns {JSX.Element}
 * @constructor
 */
const Login = () => {
  const [_userInfo, setUserInfo] = useContext(Web3Context);

  return (
    <div className="min-h-screen flex p-10">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
              Connect to your Metamask wallet
            </h2>
          </div>

          <div className="mt-4 mb-6">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => handleWalletConnect(setUserInfo, toast)}
            >
              Connect Wallet
            </button>
          </div>
          <WalletAlert
            title="Connect wallet first!"
            subtitle="Please make sure to connect your Ethereum compatible wallet AND select the Rinkeby test network before continuing!"
          />
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover rounded-lg"
          src="https://images.unsplash.com/photo-1561414926-7f3f921a2e18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=736&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

export default Login;
