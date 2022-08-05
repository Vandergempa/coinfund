import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Illust404 from "/resources/images/BoatLeak.png";

const Page404 = () => {
  const router = useRouter();
  return (
    <>
      <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-36 md:grid lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex items-center">
            <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <Image
                  src={Illust404}
                  alt="404-illustration"
                  height={355}
                  width={355}
                  className="m-auto rounded-full"
                />
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  There’s a Leak in the Website
                </h1>
                <p className="mt-3 text-base text-gray-500">
                  The boat had looked good to the naked eye. But you wear a very
                  strong prescription and should have been wearing glasses. As
                  you cling on to the bouey the coast guard had thrown at you,
                  you watch the water rush into you beloved dingy. The leak
                  sprays water higher and higher. Then the boat was swallowed
                  and sunk into the abyss.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go back home
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Page404;
