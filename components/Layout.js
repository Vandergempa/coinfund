import React from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component that contains a page for every route
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const MainLayout = (props) => {
  return (
    <div>
      <Header />
      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen bg-white rounded-lg shadow sm:px-5 sm:py-6">
            {props.children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
