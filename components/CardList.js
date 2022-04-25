import React from "react";
import SecondaryButton from "./Buttons/SecondaryButton";
import { useRouter } from "next/router";

/**
 * Cards in a grid layout to show campaign-related information
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function CardList(props) {
  const { items, showButton = false } = props;
  const router = useRouter();

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-5"
    >
      {items.map((item) => (
        <li
          key={item.description}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 break-words border-2 border-white hover:border-indigo-500"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-hidden">
              <dt className="text-sm font-medium text-gray-500">
                {item.title}
              </dt>
              <dd className="mt-1 text-1xl font-semibold text-gray-900">
                {item.subtitle}
              </dd>
              {item.description && (
                <dt className="text-sm font-light text-gray-500 mt-1">
                  {item.description}
                </dt>
              )}
            </div>
            {showButton && (
              <div className="mt-5">
                <SecondaryButton
                  buttonText="View Campaign"
                  onClick={() => {
                    router.push(`/campaigns/${item.subtitle}`);
                  }}
                />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
