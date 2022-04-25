import classNames from "classnames";
import StatusBadge from "./StatusBadge";
import SecondaryButton from "./Buttons/SecondaryButton";

/**
 * Table component to visualize requests in a table
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Table = (props) => {
  const {
    items,
    handleOnApprove,
    handleOnFinalize,
    isApproveSubmitting,
    isFinalizeSubmitting,
  } = props;

  const TableCell = (props) => {
    const { itemID, item } = props;
    return (
      <td
        className={classNames(
          itemID !== items.length - 1 ? "border-b border-gray-200" : "",
          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
        )}
      >
        {item}
      </td>
    );
  };

  const TableHeadCell = (props) => {
    const { header } = props;
    return (
      <th
        scope="col"
        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter "
      >
        {header}
      </th>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 mx-1">
          <div className="inline-block min-w-full py-2 align-middle px-2 md:px-4 lg:px-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table
                className="min-w-full border-separate"
                style={{ borderSpacing: 0 }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      ID
                    </th>
                    <TableHeadCell header="Description" />
                    <TableHeadCell header="Amount" />
                    <TableHeadCell header="Recipient" />
                    <TableHeadCell header="Approval Count" />
                    <TableHeadCell header="Status" />
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item, itemID) => (
                    <tr
                      key={itemID + item.description}
                      className={itemID % 2 === 0 ? undefined : "bg-gray-50"}
                    >
                      <td
                        className={classNames(
                          itemID !== items.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                        )}
                      >
                        {itemID + 1}
                      </td>
                      <TableCell itemID={itemID} item={item.description} />
                      <TableCell itemID={itemID} item={item.amount} />
                      <TableCell itemID={itemID} item={item.recipient} />
                      <td
                        scope="col"
                        className={classNames(
                          item.status === "Approved" && "text-green-700",
                          item.status === "Unapproved" && "text-red-700",
                          itemID !== items.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        {item.approvalCount}
                      </td>

                      <td
                        className={classNames(
                          itemID !== items.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        )}
                      >
                        <StatusBadge badgeText={item.status} />
                      </td>
                      <td
                        className={classNames(
                          itemID !== items.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
                        )}
                      >
                        {item.status !== "Completed" && (
                          <div className="flex">
                            <SecondaryButton
                              buttonText="Approve"
                              onClick={() => handleOnApprove(itemID)}
                              isLoading={isApproveSubmitting}
                              approveColor
                            />
                            <div className="ml-2">
                              <SecondaryButton
                                buttonText="Finalize"
                                onClick={() => handleOnFinalize(itemID)}
                                isLoading={isFinalizeSubmitting}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
