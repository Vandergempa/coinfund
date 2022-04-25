import CampaignFactory from "../build/CampaignFactory.json";
import { web3 } from "../../utils/web3";

/**
 * Creates an instance of a deployed factory contract
 * @returns {Contract}
 */
const getFactoryInstance = () =>
  new web3.eth.Contract(
    CampaignFactory.abi,
    "0x79b30208764ECf3401005AB6f26b3E52171ca393"
  );

export default getFactoryInstance;
