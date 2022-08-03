import React, { useState } from "react";
import { useRouter } from "next/router";
import { PlusIcon } from "@heroicons/react/solid";
import getCampaignInstance from "../../../../ethereum/utils/campaign";
import Table from "../../../../components/Table";
import { toast } from "react-hot-toast";
import { CashIcon } from "@heroicons/react/outline";
import { web3 } from "../../../../utils/web3";

/**
 * Lists fund withdrawal requests created by the contract manager
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const RequestsList = (props) => {
  const { requests = [], contributorCount = 0 } = props;
  const router = useRouter();

  const [isApproveSubmitting, setIsApproveSubmitting] = useState(false);
  const [isFinalizeSubmitting, setIsFinalizeSubmitting] = useState(false);

  /**
   * Handles approval of requests by contributors
   * @param index Index of the contract to approve
   * @returns {Promise<void>}
   */
  const handleOnApprove = async (index) => {
    const account = await web3.eth.getAccounts();
    const campaign = getCampaignInstance(router.query.cid);

    setIsApproveSubmitting(true);
    setIsFinalizeSubmitting(true);

    const loadingToast = toast.loading(
      "Your transaction is pending, please wait..."
    );
    try {
      await campaign.methods.approveRequest(index).send({
        from: account[0],
      });

      toast.success("Request has been successfully approved!");
    } catch (e) {
      toast.error(e.message);
    }
    toast.dismiss(loadingToast);
    setIsApproveSubmitting(false);
    setIsFinalizeSubmitting(false);
  };

  /**
   * Handles finalizing of a request by the manager
   * @param index Index of the request to finalize
   * @returns {Promise<void>}
   */
  const handleOnFinalize = async (index) => {
    const account = await web3.eth.getAccounts();
    const campaign = getCampaignInstance(router.query.cid);

    setIsApproveSubmitting(true);
    setIsFinalizeSubmitting(true);
    const loadingToast = toast.loading(
      "Your transaction is pending, please wait..."
    );
    try {
      await campaign.methods.finalizeRequest(index).send({
        from: account[0],
      });
      toast.success("Request has been successfully finalized!");
    } catch (e) {
      toast.error(e.message);
    }
    toast.dismiss(loadingToast);
    setIsApproveSubmitting(false);
    setIsFinalizeSubmitting(false);
  };

  /**
   * Renders the campaign's requests in a table component
   * @returns {JSX.Element}
   */
  const renderTable = () => {
    const items = requests.map((request) => {
      return {
        description: request.description,
        amount: web3.utils.fromWei(request.amount, "ether"),
        recipient: request.recipient,
        approvalCount: `${request.approvalCount}/${contributorCount}`,
        status: request.complete
          ? "Completed"
          : request.approvalCount > contributorCount / 2
          ? "Approved"
          : "Unapproved",
      };
    });
    return (
      <Table
        items={items}
        handleOnApprove={handleOnApprove}
        handleOnFinalize={handleOnFinalize}
        isApproveSubmitting={isApproveSubmitting}
        isFinalizeSubmitting={isFinalizeSubmitting}
      />
    );
  };

  return (
    <>
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col justify-start mb-3 sm:mb-0">
          <h3 className="text-1xl font-extrabold text-center sm:text-left tracking-tight text-gray-700 sm:text-2xl">
            Campaign Withdrawal Requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            See a list of withdrawal requests for the selected campaign
          </p>
        </div>
        <button
          type="button"
          className={
            "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }
          onClick={() =>
            router.push(`/campaigns/${router.query.cid}/requests/new`)
          }
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create a request{" "}
        </button>
      </div>
      {renderTable()}
      {!requests.length && (
        <div
          className="px-6"
          onClick={() =>
            router.push(`/campaigns/${router.query.cid}/requests/new`)
          }
        >
          <button
            type="button"
            className="relative block w-full group border-b-2 border-l-2 border-r-2 border-gray-300 border-dashed rounded-b-lg p-12 text-center hover:border-gray-400 focus:outline-none"
          >
            <CashIcon
              className="flex-shrink-0 h-14 w-14 m-auto text-gray-300 transition-all group-hover:scale-110"
              aria-hidden="true"
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No requests yet!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Click to add a new withdrawal request
            </p>
          </button>
        </div>
      )}
    </>
  );
};

/**
 * Pre fetches withdrawal requests, contributor count and request count for the campaign contract before render
 * @param context
 * @returns {Promise<{requestCount: int, contributorCount: int, requests: Request[]}>}
 */
RequestsList.getStaticProps = async (context) => {
  const campaign = getCampaignInstance(context.query.cid);
  const requestCount = await campaign.methods.numRequests().call();
  const contributorCount = await campaign.methods.contributorCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((e, i) => {
        return campaign.methods.requests(i).call();
      })
  );

  return { requests, requestCount, contributorCount };
};

export default RequestsList;
