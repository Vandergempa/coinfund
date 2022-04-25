import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import getCampaignInstance from "../../../../ethereum/utils/campaign";
import EtherInput from "../../../../components/EtherInput";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import SuccessModal from "../../../../components/Modals/SuccessModal";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import { web3 } from "../../../../utils/web3";

/**
 * Page to create a new fund withdrawal request by the manager
 * @returns {JSX.Element}
 * @constructor
 */
const RequestNew = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [etherInput, setEtherInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  /**
   * Handles request creation
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

      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(etherInput, "ether"),
          address
        )
        .send({
          from: accounts[0],
        });

      setSuccessModalOpen(true);
    } catch (e) {
      toast.error(e.message);
    }
    toast.dismiss(loadingToast);
    setIsSubmitting(false);
  };
  return (
    <>
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col">
        <h3 className="text-1xl font-extrabold tracking-tight text-gray-700 sm:text-2xl">
          Create a request
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a fund withdrawal request as the manager of the contract
        </p>
      </div>
      <section className="p-8 sm:p-5 sm:w-8/12 m-auto">
        <form className="space-y-3" onSubmit={handleOnSubmit}>
          <div className="sm:col-span-3">
            <label
              htmlFor="recipient-address"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient's address
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="recipient-address"
                id="recipient-address"
                autoComplete="wallet-address"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Describe the reasons for your request in a few sentences.
            </p>
          </div>

          <EtherInput
            etherInput={etherInput}
            setEtherInput={setEtherInput}
            inputLabel="Amount to withdraw"
            currency="Ether"
          />

          <div className="flex justify-between pt-3">
            <PrimaryButton
              buttonText="Create request"
              isSubmit={true}
              isLoading={isSubmitting}
            />
            <SecondaryButton
              buttonText="Back"
              onClick={() => window.history.back()}
            />
          </div>
        </form>
        <SuccessModal
          isOpen={successModalOpen}
          setIsOpen={setSuccessModalOpen}
          onClose={() => {
            setSuccessModalOpen(false);
            router.push(`/campaigns/${router.query.cid}/requests`);
          }}
          title="Transaction successful!"
          subtitle="Withdrawal request has been successfully created!"
          buttonText="Back to Requests"
        />
      </section>
    </>
  );
};

export default RequestNew;
