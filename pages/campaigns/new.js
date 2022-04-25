import React, { useState } from "react";
import EtherInput from "../../components/EtherInput";
import getFactoryInstance from "../../ethereum/utils/factory";
import { toast } from "react-hot-toast";
import SuccessModal from "../../components/Modals/SuccessModal";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useRouter } from "next/router";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { web3 } from "../../utils/web3";

/**
 * Page to create new campaigns
 * @returns {JSX.Element}
 * @constructor
 */
const CampaignNew = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [etherInput, setEtherInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  /**
   * Handle function to create a new campaign using the factory contract
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
      await getFactoryInstance()
        .methods.createCampaign(
          web3.utils.toWei(etherInput, "ether"),
          description
        )
        .send({ from: accounts[0] });

      setSuccessModalOpen(true);
    } catch (e) {
      toast.error(e.message);
    }
    toast.dismiss(loadingToast);
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-1xl font-extrabold tracking-tight text-gray-700 sm:text-2xl">
          Create a campaign
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a new crowdfund campaign
        </p>
      </div>
      <section className="p-8 sm:p-5 sm:w-8/12 m-auto">
        <form className="space-y-3" onSubmit={handleOnSubmit}>
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
              Describe your campaign in a few words.
            </p>
          </div>

          <EtherInput
            etherInput={etherInput}
            setEtherInput={setEtherInput}
            inputLabel="Set minimum amount to contribute"
            currency="Ether"
          />

          <div className="flex justify-between pt-3">
            <PrimaryButton
              buttonText="Create campaign"
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
            router.push("/");
          }}
          title="Transaction successful!"
          subtitle="Your transaction has successfully went through! Good work
                      on creating a campaign!"
          buttonText="Back to Dashboard"
        />
      </section>
    </>
  );
};

export default CampaignNew;
