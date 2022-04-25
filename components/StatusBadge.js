/**
 * Shows a status badge
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const StatusBadge = (props) => {
  const { badgeText } = props;

  switch (badgeText) {
    case "Completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {badgeText}
        </span>
      );
    case "Unapproved":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {badgeText}
        </span>
      );
    case "Approved":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          {badgeText}
        </span>
      );
  }

  return <></>;
};

export default StatusBadge;
