import React, { useState } from "react";
import { useRouter } from "next/router";
import getCampaignInstance from "../../../ethereum/utils/campaign";
import CardList from "../../../components/CardList";
import ContributeCTA from "../../../components/ContributeCTA";
import SuccessModal from "../../../components/Modals/SuccessModal";
import { toast } from "react-hot-toast";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import Card from "../../../components/Card";
import { web3 } from "../../../utils/web3";

/**
 * Shows campaign details like required min. contribution, contract balance,
 * manager's address, etc.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const CampaignDetails = (props) => {
  const {
    minimumContribution,
    contractBalance,
    requestCount,
    contributorCount,
    managerAddress,
    description,
  } = props;

  const router = useRouter();
  const [etherInput, setEtherInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  /**
   * Handles contributing to a campaign
   * @param e Event object
   * @returns {Promise<void>}
   */
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      "Your transaction is pending, please wait..."
    );
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = getCampaignInstance(router.query.cid);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(etherInput, "ether"),
      });

      setSuccessModalOpen(true);
    } catch (e) {
      toast.error(e.message);
    }
    toast.dismiss(loadingToast);
    setIsSubmitting(false);
  };

  /**
   * Renders contract details in cards in a grid layout
   * @returns {JSX.Element}
   */
  const renderCards = () => {
    const items = [
      {
        title: "Contract Manager's Address",
        subtitle: managerAddress,
        description:
          "The manager created this campaign and can create requests to withdraw money form the contract",
      },
      {
        title: "Minimum Contribution",
        subtitle: web3.utils.fromWei(minimumContribution, "ether"),
        description:
          "This is the minimum amount (in ether) to contribute to become a contributor",
      },
      {
        title: "Number of contributors",
        subtitle: contributorCount,
        description: "Number of times people have contributed to this project",
      },
      {
        title: "Contract balance /ether/",
        subtitle: web3.utils.fromWei(contractBalance, "ether"),
        description: "Total amount of ether that has been contributed so far",
      },
      {
        title: "Number of withdraw requests",
        subtitle: requestCount,
        description:
          "Number of times the manager has requested fund withdrawals",
      },
    ];
    return (
      <div>
        <Card title="Description of the campaign" description={description} />
        <CardList items={items} />
      </div>
    );
  };

  return (
    <>
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col justify-start mb-3 sm:mb-0">
          <h3 className="text-1xl font-extrabold text-center sm:text-left tracking-tight text-gray-700 sm:text-2xl">
            Campaign Details
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            See stats about your campaign's performance
          </p>
        </div>
        <PrimaryButton
          buttonText="View Requests"
          onClick={() => router.push(`/campaigns/${router.query.cid}/requests`)}
        />
      </div>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="lg:w-7/12">{renderCards()}</div>
        <div className="lg:w-5/12">
          <ContributeCTA
            onSubmit={handleOnSubmit}
            etherInput={etherInput}
            setEtherInput={setEtherInput}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <SuccessModal
        isOpen={successModalOpen}
        setIsOpen={setSuccessModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          router.push("/");
        }}
        title="Transaction successful!"
        subtitle="Your transaction has successfully went through! Thank you for contributing to the campaign!"
        buttonText="Back to Dashboard"
      />
    </>
  );
};

/**
 * Calls getSummary of the campaign instance to fetch campaign details before render
 * @param context
 * @returns {Promise<{contractBalance, requestCount, managerAddress, contributorCount, description, minimumContribution}>}
 */
export const getServerSideProps = async (context) => {
  let campaign;
  let summary;
  try {
    campaign = getCampaignInstance(context.query.cid);
    summary = await campaign.methods.getSummary().call();
  } catch {
    console.log("Another error 2");
  }

  return {
    props: {
      minimumContribution: summary[0],
      contractBalance: summary[1],
      requestCount: summary[2],
      contributorCount: summary[3],
      managerAddress: summary[4],
      description: summary[5],
    },
  };
};

export default CampaignDetails;
