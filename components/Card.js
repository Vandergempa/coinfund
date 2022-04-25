import React from "react";

/**
 * Shows campaign-related information in a card
 * @returns {JSX.Element}
 * @constructor
 */
const Card = (props) => {
  const { title, description } = props;
  return (
    <div className="bg-white rounded-lg mx-5 md:mt-4 shadow divide-y divide-gray-200 break-words border-2 border-white hover:border-indigo-500">
      <div className="px-4 py-5 sm:p-6">
        <div className="overflow-hidden">
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dt className="text-sm font-light text-gray-500 mt-1">
            {description}
          </dt>
        </div>
      </div>
    </div>
  );
};

export default Card;
