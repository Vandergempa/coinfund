import React, { useContext, useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Metamask from "/resources/icons/metamask.svg";
import Coin from "/resources/icons/coin.svg";
import Mosaic from "/resources/images/mosaic.jpg";
import BreadCrumb from "./BreadCrumb";
import { Web3Context } from "../pages/_app";
import { toast } from "react-hot-toast";

import classNames from "classnames";
import { handleWalletConnect } from "../utils/web3";

/**
 * Top "navigation" bar - header
 * @returns {JSX.Element}
 * @constructor
 */
const Header = () => {
  const [userInfo, setUserInfo, network, isProvider] = useContext(Web3Context);
  const [profileImg, setProfileImg] = useState(Metamask);

  useEffect(() => {
    userInfo && userInfo.connectionId && setProfileImg(Mosaic);
    !userInfo || (userInfo && !userInfo.account && setProfileImg(Metamask));
  }, [userInfo]);

  const renderConnectDiv = (isMobile = false) => {
    return !userInfo || (userInfo && !userInfo.account) ? (
      <div
        className={classNames(
          isMobile ? "m-5" : "",
          "max-w-max flex items-center group cursor-pointer transition-all border-2 border-white hover:border-indigo-100 hover:scale-90 p-1 rounded-md"
        )}
        onClick={() => handleWalletConnect(setUserInfo, toast)}
      >
        <p className="ml-4 text-sm font-medium text-white group-hover:text-indigo-100">
          Connect Wallet
        </p>

        <div className="ml-3 relative flex-shrink-0">
          <div className="bg-indigo-600 rounded-full flex text-sm text-white ">
            <Image
              src={profileImg}
              alt="profile-logo"
              height={35}
              width={35}
              className="m-auto rounded-full"
            />
          </div>
        </div>
      </div>
    ) : (
      <div
        className={classNames(
          isMobile && "mb-1 mr-1",
          "flex items-center group cursor-pointer transition-all p-1 rounded-md"
        )}
        onClick={() => null}
      >
        <div className="ml-4 mt-4 mb-2 truncate">
          <h3 className="text-sm leading-6 font-medium text-white">
            {userInfo.account}
          </h3>
          <p className=" text-xs text-indigo-200">{userInfo.balance} Ether</p>
        </div>

        <div className="ml-3 relative flex-shrink-0">
          <div className="bg-indigo-600 rounded-full flex text-sm text-white">
            <Image
              src={profileImg}
              alt="profile-logo"
              height={35}
              width={35}
              className="m-auto rounded-full"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-full">
        <div className="bg-indigo-600 pb-32">
          <Disclosure
            as="nav"
            className="bg-indigo-600 border-b border-indigo-300 border-opacity-25 lg:border-none"
          >
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                  <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-indigo-400 lg:border-opacity-25">
                    <div className="px-2 flex items-center lg:px-0">
                      <div className="flex flex-shrink-0 flex-row">
                        <Image
                          src={Coin}
                          alt="brand-logo"
                          height={30}
                          width={30}
                        />
                        <h1 className="text-2xl font-bold text-white ml-1 mb-1">
                          coin<span className="font-thin">fund</span>
                        </h1>
                      </div>
                    </div>
                    {/*<div className="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end">*/}
                    {/*  <div className="max-w-lg w-full lg:max-w-xs">*/}
                    {/*    <label htmlFor="search" className="sr-only">*/}
                    {/*      Search*/}
                    {/*    </label>*/}
                    {/*    <div className="relative text-gray-400 focus-within:text-gray-600">*/}
                    {/*      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">*/}
                    {/*        <SearchIcon*/}
                    {/*          className="h-5 w-5"*/}
                    {/*          aria-hidden="true"*/}
                    {/*        />*/}
                    {/*      </div>*/}
                    {/*      <input*/}
                    {/*        id="search"*/}
                    {/*        className="block w-full bg-white py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white focus:border-white sm:text-sm"*/}
                    {/*        placeholder="Search"*/}
                    {/*        type="search"*/}
                    {/*        name="search"*/}
                    {/*      />*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                    <div className="flex lg:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-indigo-600 p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-indigo-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    {isProvider && (
                      <div className="hidden lg:block lg:ml-4">
                        {renderConnectDiv(false)}
                      </div>
                    )}
                  </div>
                </div>

                <Disclosure.Panel className="lg:hidden">
                  {isProvider && renderConnectDiv(true)}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {network === "rinkeby" && userInfo && userInfo.account && (
              <BreadCrumb />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
